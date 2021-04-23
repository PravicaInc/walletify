import {Subdomains, registrars} from '@stacks/keychain';

const STACKS = 'id.stx';
registrars[STACKS] = {
  registerUrl: 'https://registrar.stacks.co/register',
  apiUrl: 'https://registrar.stacks.co/v1/names',
  addressVersion: 22,
};

export const gaiaUrl = 'https://hub.blockstack.org';

export const Subdomain: Subdomains = STACKS;

export const USERNAMES_ENABLED = true;
