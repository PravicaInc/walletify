import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import { makeAutoObservable } from 'mobx';
import { Language } from './types';
import { EN } from '../../translations';
import { RootStore } from '../RootStore';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-community/async-storage';
import { LANGUAGES } from '../../shared/constants';

export class LocalizationStore {
  rootStore: RootStore;
  currentLanguage: Language = LANGUAGES[0];

  translate: (arg0: any) => string = () => '';

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    makePersistable(this, {
      name: 'localization',
      properties: ['currentLanguage'],
      storage: AsyncStorage,
    });
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  private setTranslate(translateFn: (key: any, config?: any) => string) {
    this.translate = translateFn;
  }

  private setCurrentLanguage = (
    language: Language,
    translations: Record<string, string>,
  ) => {
    const newTranslate = memoize(
      (key: any, config?: any) => i18n.t(key, config),
      (key: any, config: any) => (config ? key + JSON.stringify(config) : key),
    );
    newTranslate.cache.clear!();
    i18n.translations = {
      [language.key]: translations,
    };
    i18n.locale = language.key;
    this.setTranslate(newTranslate);
    this.currentLanguage = language;
  };

  updateTranslations = async (language: Language) => {
    try {
      const translationMap = language.key === 'en' ? EN : EN;
      this.setCurrentLanguage(language, translationMap);
    } catch (err) {
      Promise.reject(err);
    }
  };
}
