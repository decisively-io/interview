import Polyglot from 'node-polyglot';

export default (getMessages, initialLocale = 'en', polyglotOptions = {}) => {
  let locale = initialLocale;
  const messages = getMessages(initialLocale);
  if (messages instanceof Promise) {
    throw new Error(
      `The i18nProvider returned a Promise for the messages of the default locale (${initialLocale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`,
    );
  }
  const polyglot = new Polyglot({
    locale,
    allowMissing: true,
    phrases: { '': '', ...messages },
    ...polyglotOptions,
  });
  let translate = polyglot.t.bind(polyglot);
  return {
    translate: (key, options = {}) => (key ? translate(key, options) : null),
    /*addMessages: (newMessages) => {
      const newPolyglot = new Polyglot({
        locale: locale,
        phrases: { '': '', ...messages, ...newMessages },
        ...polyglotOptions,
      });
      translate = newPolyglot.t.bind(newPolyglot);
    },*/
    changeLocale: (newLocale, additionalMessages = {}) => new Promise((resolve) =>
      // so we systematically return a Promise for the messages
      // i18nProvider may return a Promise for language changes,
      resolve(getMessages(newLocale))).then((localeMessages) => {
        console.log('changeLocale', localeMessages, additionalMessages)
      locale = newLocale;
      const newPolyglot = new Polyglot({
        locale: newLocale,
        phrases: { '': '', ...localeMessages, ...(additionalMessages[newLocale] || {}) },
        ...polyglotOptions,
      });
      translate = newPolyglot.t.bind(newPolyglot);
    }),
    getLocale: () => locale,
  };
};
