import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { atom, useAtom } from 'jotai';
import {useAtomValue} from "jotai/utils";

export const hasInternetState = atom<boolean>(true);

export const useInternetConnection = () => {
  const [, setHasInternet] = useAtom(hasInternetState);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setHasInternet(true);
      } else {
        setHasInternet(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
};

export const useInternetConnectionValue = () => {
  return useAtomValue(hasInternetState);
};
