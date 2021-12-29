import { makeProfileZoneFile } from '@stacks/profile';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROFILE_FILE_NAME,
  signProfileForUpload,
} from '@stacks/wallet-sdk/dist/models/profile';
import { uploadToGaiaHub, GaiaHubConfig } from '@stacks/storage';
import { AccountWithAddress } from '../models/account';
import { registrars, Subdomains } from './constants';

export enum IdentityNameValidityError {
  MINIMUM_LENGTH = 'Name must be At Least 8 Characters',
  MAXIMUM_LENGTH = "Names Shouldn't have more than 37 characters",
  ILLEGAL_CHARACTER = 'Invalid Character names Should contain only letters and numbers and _',
  UNAVAILABLE = 'The Name you chose is unavailable',
}

interface RegisterParams {
  account: AccountWithAddress;
  username: string;
  gaiaHubConfig: GaiaHubConfig;
}

const sendUsernameToRegistrar = async ({
  username,
  zoneFile,
  accountAddress,
  subdomain,
}: {
  username: string;
  zoneFile: string;
  accountAddress: string;
  subdomain: Subdomains;
}) => {
  const registerUrl = registrars[subdomain].registerUrl;
  const registrationRequestBody = JSON.stringify({
    name: username,
    owner_address: accountAddress,
    zonefile: zoneFile,
  });
  const requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const response = await fetch(registerUrl, {
    method: 'POST',
    headers: requestHeaders,
    body: registrationRequestBody,
  });
  if (!response.ok) {
    return Promise.reject({
      error: 'Failed to register username',
      status: response.status,
    });
  }
  console.log('Registrar Response');
  return response.json();
};

export const registerSubdomain = async ({
  account,
  username,
  gaiaHubConfig,
}: RegisterParams) => {
  try {
    const profile = account.profile || DEFAULT_PROFILE;
    const signedProfileTokenData = signProfileForUpload({ profile, account });
    const profileResponse = await uploadToGaiaHub(
      DEFAULT_PROFILE_FILE_NAME,
      signedProfileTokenData,
      gaiaHubConfig,
      undefined,
      undefined,
      undefined,
      true,
    );
    const fullUsername = `${username}.${Subdomains.STACKS}`;
    const zoneFile = makeProfileZoneFile(
      fullUsername,
      profileResponse.publicURL,
    );
    const nameResponse = await sendUsernameToRegistrar({
      username,
      zoneFile,
      accountAddress: account.address,
      subdomain: Subdomains.STACKS,
    });
    console.log(nameResponse);
  } catch (err) {
    console.log('registrarError', err);
  }
};

const containsLegalCharacters = (name: string) => /^[a-z0-9_]+$/.test(name);

export const validateSubdomainFormat = (
  identityName: string,
): IdentityNameValidityError | null => {
  const nameLength = identityName.length;

  if (nameLength < 8) {
    return IdentityNameValidityError.MINIMUM_LENGTH;
  }

  if (nameLength > 37) {
    return IdentityNameValidityError.MAXIMUM_LENGTH;
  }

  if (!containsLegalCharacters(identityName)) {
    return IdentityNameValidityError.ILLEGAL_CHARACTER;
  }

  return null;
};

export const validateSubdomainAvailability = async (
  name: string,
  subdomain: Subdomains = Subdomains.STACKS,
) => {
  const url = `${
    registrars[subdomain].apiUrl
  }/${name.toLowerCase()}.${subdomain}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};

export const validateSubdomain = async (
  name: string,
  subdomain: Subdomains = Subdomains.STACKS,
) => {
  const error = validateSubdomainFormat(name);
  if (error) {
    return error;
  }
  try {
    const data = await validateSubdomainAvailability(name, subdomain);
    if (data.status !== 'available') {
      return IdentityNameValidityError.UNAVAILABLE;
    }
  } catch (err) {
    return IdentityNameValidityError.UNAVAILABLE;
  }
  return null;
};
