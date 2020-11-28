import { createContext } from 'react';

export const TranslationContext = createContext({
  locale: 'en',
  setLocale: () => Promise.resolve(),
  i18nProvider: {
    translate: (x) => x,
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
   // addMessages: (x) => x
  },
});
