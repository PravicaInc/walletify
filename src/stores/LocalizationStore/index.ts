import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import { action, makeAutoObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { createModelSchema, primitive } from 'serializr';
import { Language } from './types';
import { EN } from '../../translations';
import { RootStore } from '../RootStore';

createModelSchema(Language, {
  key: primitive(),
  title: primitive(),
  isRTL: primitive(),
});

export class LocalizationStore {
  rootStore: RootStore;
  @persist('object', Language) currentLanguage: Language;

  @observable translate: (arg0: any) => string = () => '';

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  private setTranslate(translateFn: (key: any, config?: any) => string) {
    this.translate = translateFn;
  }

  @action private setCurrentLanguage = (
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

  @action updateTranslations = async (language: Language) => {
    try {
      const translationMap = language.key === 'en' ? EN : EN;
      this.setCurrentLanguage(language, translationMap);
    } catch (err) {
      Promise.reject(err);
    }
  };
}
