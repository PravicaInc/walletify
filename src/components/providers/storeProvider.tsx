import React, { ReactElement, ReactNode } from 'react';
import { StoreContext } from '../../contexts/stores';
import rootStore  from '../../stores/RootStore';

export type StoreComponent = React.FC<{
  children: ReactNode;
}>;

export const StoresProvider: StoreComponent = ({
  children,
}): ReactElement => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};
