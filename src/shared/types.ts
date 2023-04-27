import { AuthOptions } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';

export interface PuzzleItem<T> {
  index: number;
  value: T;
}

export interface FeeEstimation {
  fee: number;
  fee_rate: number;
}

export interface FeeEstimationWithLevels extends FeeEstimation {
  level: EstimationsLevels;
}

export interface SelectedFee {
  fee?: string;
  level?: EstimationsLevels;
}
export enum EstimationsLevels {
  Low = 'Low',
  Middle = 'Standard',
  High = 'High',
  Custom = 'Custom',
}

export interface CommonSignaturePayload {
  publicKey: string;
  /**
   * Provide the Hiro Wallet with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  appDetails?: AuthOptions['appDetails'];
  network?: StacksNetwork;
  postConditions?: null;
}
export interface SignaturePayload extends CommonSignaturePayload {
  message: string;
}
export interface SignatureData {
  /* Hex encoded DER signature */
  signature: string;
  /* Hex encoded private string taken from privateKey */
  publicKey: string;
}
export enum StacksMessageType {
  Address,
  Principal,
  LengthPrefixedString,
  MemoString,
  AssetInfo,
  PostCondition,
  PublicKey,
  LengthPrefixedList,
  Payload,
  MessageSignature,
  StructuredDataSignature,
  TransactionAuthField,
}
export interface StructuredDataSignature {
  readonly type: StacksMessageType.StructuredDataSignature;
  data: string;
}
