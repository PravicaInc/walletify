import { atom } from 'jotai';
import AsyncStorage from '@react-native-community/async-storage';

export const atomWithAsyncStorage = (key: string, initialValue: any) => {
  const baseAtom = atom(initialValue);
  baseAtom.onMount = setValue => {
    (async () => {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    })();
  };
  return atom(
    get => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      AsyncStorage.setItem(key, JSON.stringify(nextValue));
    },
  );
};
