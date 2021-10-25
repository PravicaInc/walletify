import { Language } from '../stores/localization/types';
import { useStores } from './useStores';

export const useLocalization = () => {
  const { localizationStore, hydrateStores } = useStores();

  const { updateTranslations, translate, currentLanguage } = localizationStore;

  const onChangeLanguage = async () => {
    await hydrateStores();
  };

  const changeLanguage = async (language: Language) => {
    await updateTranslations(language).then(() => {
      onChangeLanguage();
    });
  };

  return {
    changeLanguage,
    translate,
    currentLanguage,
  };
};
