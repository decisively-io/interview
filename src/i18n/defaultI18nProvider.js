import defaultMessages from './language-english';
//import coreFrenchMessages from './language-french';
//import coreChineseMessages from './language-chinese';
import polyglotI18nProvider from './polyglotI18nProvider';

const messages = {
  en: defaultMessages,
//  fr: coreFrenchMessages,
//  zh: coreChineseMessages,
};

export default function (locale = 'en', appMessages = {}, options={}) {
  console.log('options', options);
  return polyglotI18nProvider((_locale) => {
    const _appMessages = appMessages[_locale] || appMessages.en;
    const _messages = messages[_locale] || messages.en;
    return { ..._messages, ..._appMessages };
  }, locale, options);
}
