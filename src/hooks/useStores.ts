import { useContext } from 'react';
import { RootStore } from '../stores/RootStore';
import { StoreContext } from '../contexts/stores';

export const useStores = (): RootStore => useContext(StoreContext);
