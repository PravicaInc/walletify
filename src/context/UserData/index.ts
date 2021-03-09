import * as React from 'react';

interface IContextValues {
  success: boolean;
  failure: boolean;
  loading: boolean;
  signIn: () => Promise<any>;
  signOut: () => Promise<any>;
}

export const UserData = React.createContext<IContextValues>({
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  failure: false,
  success: false,
  loading: false,
});
