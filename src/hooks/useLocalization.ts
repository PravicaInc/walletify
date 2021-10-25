import { Language } from '../stores/LocalizationStore/types';
import { useStores } from './useStores';

export const useLocalization = () => {
  const { localizationStore } = useStores();

  const { updateTranslations, translate, currentLanguage } = localizationStore;

  const changeLanguage = async (language: Language) => {
    await updateTranslations(language);
  };

  return {
    changeLanguage,
    translate,
    currentLanguage,
  };
};
