import { useContext, useCallback } from 'react';

import { TranslationContext } from './TranslationContext';
//import useUpdateLoading from '../redux/sagas/loading';
import useNotify from '../redux/useNotify';

/**
 * Set the current locale using the TranslationContext
 *
 * This hook rerenders when the locale changes.
 *
 * @example
 *
 * import { useLocale } from 'react-admin';
 *
 * const availableLanguages = {
 *     en: 'English',
 *     fr: 'Français',
 * }
 * const LanguageSwitcher = () => {
 *     const setLocale = useSetLocale();
 *     return (
 *         <ul>{
 *             Object.keys(availableLanguages).map(locale => {
 *                  <li key={locale} onClick={() => setLocale(locale)}>
 *                      {availableLanguages[locale]}
 *                  </li>
 *              })
 *         }</ul>
 *     );
 * }
 */
const useSetLocale = () => {
  const { setLocale, i18nProvider } = useContext(TranslationContext);
  const notify = useNotify();
  
  return useCallback(
    (newLocale, additionalMessages) => new Promise((resolve) => {
      // so we systematically return a Promise for the messages
      // i18nProvider may return a Promise for language changes,
      resolve(i18nProvider.changeLocale(newLocale, additionalMessages));
    })
      .then(() => {
        setLocale(newLocale);
      })
      .catch((error) => {
        notify('dp.notification.i18n_error', 'warning');
      }),
    [i18nProvider, notify, setLocale],
  );
};

export default useSetLocale;
