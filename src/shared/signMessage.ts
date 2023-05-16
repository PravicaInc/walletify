import {
  ClarityValue,
  StacksPrivateKey,
  getPublicKey,
  publicKeyToString,
  MessageSignature,
  signWithKey,
  ClarityType,
  serializeCV,
} from '@stacks/transactions';
import {
  SignatureData,
  StacksMessageType,
  StructuredDataSignature,
} from './types';
import { sha256 } from '@noble/hashes/sha256';

const hexes = Array.from({ length: 256 }, (_, i) =>
  i.toString(16).padStart(2, '0'),
);
const chainPrefix = '\x17Stacks Signed Message:\n';
const MAX_SAFE_INTEGER = 9_007_199_254_740_991;
export const STRUCTURED_DATA_PREFIX = new Uint8Array([
  0x53, 0x49, 0x50, 0x30, 0x31, 0x38,
]);

export function utf8ToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
function ensureUInt53(n: number) {
  if (n < 0 || n > MAX_SAFE_INTEGER || n % 1 !== 0) {
    throw new RangeError('value out of range');
  }
}
export function encodingLength(number: number) {
  ensureUInt53(number);

  return number < 0xfd
    ? 1
    : number <= 0xff_ff
    ? 3
    : number <= 0xff_ff_ff_ff
    ? 5
    : 9;
}
export function writeUInt8(
  destination: Uint8Array,
  value: number,
  offset: number,
): void {
  destination[offset] = value;
}
export function writeUInt16LE(
  destination: Uint8Array,
  value: number,
  offset: number,
): void {
  destination[offset + 0] = value & 0b1111_1111;
  value >>>= 8;
  destination[offset + 1] = value & 0b1111_1111;
}
export function writeUInt32LE(
  destination: Uint8Array,
  value: number,
  offset: number,
): void {
  destination[offset + 0] = value & 0b1111_1111;
  value >>>= 8;
  destination[offset + 1] = value & 0b1111_1111;
  value >>>= 8;
  destination[offset + 2] = value & 0b1111_1111;
  value >>>= 8;
  destination[offset + 3] = value & 0b1111_1111;
}
export function encode(number: number, bytes?: Uint8Array, offset: number = 0) {
  ensureUInt53(number);
  if (!bytes) {
    bytes = new Uint8Array(encodingLength(number));
  }

  // 8 bit
  if (number < 0xfd) {
    writeUInt8(bytes, number, offset);

    // 16 bit
  } else if (number <= 0xff_ff) {
    writeUInt8(bytes, 0xfd, offset);
    writeUInt16LE(bytes, number, offset + 1);

    // 32 bit
  } else if (number <= 0xff_ff_ff_ff) {
    writeUInt8(bytes, 0xfe, offset);
    writeUInt32LE(bytes, number, offset + 1);

    // 64 bit
  } else {
    writeUInt8(bytes, 0xff, offset);
    writeUInt32LE(bytes, number >>> 0, offset + 1);
    writeUInt32LE(bytes, (number / 0x1_00_00_00_00) | 0, offset + 5);
  }

  return bytes;
}
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  if (!arrays.every(a => a instanceof Uint8Array)) throw new Error('Uint8Array list expected');
  if (arrays.length === 1) return arrays[0];
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}
export function encodeMessage(
  message: string | Uint8Array,
  prefix: string = chainPrefix,
): Uint8Array {
  const messageBytes =
    typeof message === 'string' ? utf8ToBytes(message) : message;
  const encodedLength = encode(messageBytes.length);
  return concatBytes(utf8ToBytes(prefix), encodedLength, messageBytes);
}
export async function hashMessage(
  message: string,
  prefix: string = chainPrefix,
): Promise<Uint8Array> {
  return sha256(encodeMessage(message, prefix));
}
export function bytesToHex(uint8a: Uint8Array): string {
  // pre-caching improves the speed 6x
  if (!(uint8a instanceof Uint8Array)) {
    throw new Error('Uint8Array expected');
  }
  let hex = '';
  for (const u of uint8a) {
    hex += hexes[u];
  }
  return hex;
}
export function signatureVrsToRsv(signature: string) {
  return signature.slice(2) + signature.slice(0, 2);
}
export function signMessageHashRsv({
  messageHash,
  privateKey,
}: {
  messageHash: string;
  privateKey: StacksPrivateKey;
}): MessageSignature {
  const messageSignature = signWithKey(privateKey, messageHash);
  return {
    ...messageSignature,
    data: signatureVrsToRsv(messageSignature.data),
  };
}
export async function signMessage(
  message: string,
  privateKey: StacksPrivateKey,
): Promise<SignatureData> {
  const hash = await hashMessage(message);
  return {
    signature: signMessageHashRsv({ privateKey, messageHash: bytesToHex(hash) })
      .data,
    publicKey: publicKeyToString(getPublicKey(privateKey)),
  };
}
export async function hashStructuredData(
  structuredData: ClarityValue,
): Promise<Uint8Array> {
  return sha256(serializeCV(structuredData));
}

function isDomain(value: ClarityValue): boolean {
  if (value.type !== ClarityType.Tuple) {
    return false;
  }
  // Check that the tuple has at least 'name', 'version' and 'chain-id'
  if (!['name', 'version', 'chain-id'].every(key => key in value.data)) {
    return false;
  }
  // Check each key is of the right type
  if (
    !['name', 'version'].every(
      key => value.data[key].type === ClarityType.StringASCII,
    )
  ) {
    return false;
  }

  if (value.data['chain-id'].type !== ClarityType.UInt) {
    return false;
  }
  return true;
}
export async function encodeStructuredData({
  message,
  domain,
}: {
  message: ClarityValue;
  domain: ClarityValue;
}): Promise<Uint8Array> {
  const structuredDataHash: Uint8Array = await hashStructuredData(message);
  if (!isDomain(domain)) {
    throw new Error(
      "domain parameter must be a valid domain of type TupleCV with keys 'name', 'version', 'chain-id' with respective types StringASCII, StringASCII, UInt",
    );
  }
  const domainHash: Uint8Array = await hashStructuredData(domain);

  return concatBytes(STRUCTURED_DATA_PREFIX, domainHash, structuredDataHash);
}
export async function signStructuredData({
  message,
  domain,
  privateKey,
}: {
  message: ClarityValue;
  domain: ClarityValue;
  privateKey: StacksPrivateKey;
}): Promise<StructuredDataSignature> {
  const encodedStructuredData = await encodeStructuredData({ message, domain });
  const structuredDataHash: string = bytesToHex(
    // @ts-ignore
    await sha256(encodedStructuredData),
  );

  const { data } = signMessageHashRsv({
    messageHash: structuredDataHash,
    privateKey,
  });
  return {
    data,
    type: StacksMessageType.StructuredDataSignature,
  };
}
export async function signStructuredDataMessage(
  message: ClarityValue,
  domain: ClarityValue,
  privateKey: StacksPrivateKey,
): Promise<SignatureData> {
  const signature = (
    await signStructuredData({
      message,
      domain,
      privateKey,
    })
  ).data;

  return {
    signature,
    publicKey: publicKeyToString(getPublicKey(privateKey)),
  };
}
