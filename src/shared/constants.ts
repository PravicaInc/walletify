export const gaiaUrl = 'https://hub.blockstack.org';
export const MICROBLOCKS_ENABLED = true;
export enum Subdomains {
  STACKS = 'id.stx',
}
export const registrars = {
  [Subdomains.STACKS]: {
    registerUrl: 'https://registrar.stacks.co/register',
    apiUrl: 'https://registrar.stacks.co/v1/names',
  },
};
