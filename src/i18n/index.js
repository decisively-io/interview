import defaultI18nProvider from './defaultI18nProvider';
import TranslationProvider from './TranslationProvider';
import useSetLocale from './useSetLocale';
import useLocale from './useLocale';
import useTranslate from './useTranslate';
//import useAddMessages from './useAddMessages';
import polyglotI18nProvider from './polyglotI18nProvider';
import translate from './translate';

export {
  translate, defaultI18nProvider, TranslationProvider, useLocale,
  useSetLocale, useTranslate, polyglotI18nProvider,
};
export const DEFAULT_LOCALE = 'en';
