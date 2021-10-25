import { createContext } from 'react';
import rootStore, { RootStore } from '../stores/RootStore';

export const StoreContext = createContext<RootStore>(rootStore);
