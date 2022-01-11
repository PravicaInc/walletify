import { useAtomValue } from 'jotai/utils';
import { assets } from './assetsStore';

export const useAssets = () => {
  const selectedAccountAssets = useAtomValue(assets);

  return {
    selectedAccountAssets,
  };
};
