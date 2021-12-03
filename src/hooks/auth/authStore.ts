import { atom } from 'jotai';
import { AuthRequestState } from '../../models/auth';

export const authRequestState = atom<AuthRequestState>({
  authRequest: undefined,
  decodedAuthRequest: undefined,
  appName: undefined,
  appIcon: undefined,
  appURL: undefined,
});
