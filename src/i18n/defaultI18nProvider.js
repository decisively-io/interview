import defaultMessages from './default_messages';
import polyglotI18nProvider from './polyglotI18nProvider';

export default function (locale = 'en', appMessages = {}, options={}) {
  return polyglotI18nProvider((_locale) => {
    const _appMessages = appMessages[_locale] || appMessages.en;
    const _messages = defaultMessages[_locale] || defaultMessages.en;
    return { ..._messages, ..._appMessages };
  }, locale, options);
}
