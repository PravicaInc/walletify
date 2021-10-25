import React, { ReactElement, ReactNode } from 'react';
import { StoreContext } from '../../contexts/stores';
import { RootStore } from '../../stores/RootStore';

export type StoreComponent = React.FC<{
  store: RootStore;
  children: ReactNode;
}>;

export const StoresProvider: StoreComponent = ({
  children,
  store,
}): ReactElement => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
