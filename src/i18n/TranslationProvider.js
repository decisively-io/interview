import React, {
  useCallback,
  useMemo,
  Children,
  useState, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { TranslationContext } from './TranslationContext';

function useSafeSetState(initialState) {
  const [state, setState] = useState(initialState);

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);
  const safeSetState = useCallback(
    (args) => mountedRef.current && setState(args),
    [mountedRef, setState],
  );
  return [state, safeSetState];
}

/**
 * Creates a translation context, available to its children
 *
 * @example
 *     const MyApp = () => (
 *         <Provider store={store}>
 *             <TranslationProvider i18nProvider={i18nProvider}>
 *                 <!-- Child components go here -->
 *             </TranslationProvider>
 *         </Provider>
 *     );
 */

const TranslationProvider = (props) => {
  const { i18nProvider, children } = props;

  const [state, setState] = useSafeSetState({
    locale: i18nProvider ? i18nProvider.getLocale() : 'en',
    i18nProvider,
  });

  const setLocale = useCallback(
    (newLocale) => setState({
      locale: newLocale,
      i18nProvider,
    }),
    [i18nProvider, setState],
  );

  // Allow locale modification by including setLocale in the context
  // This can't be done in the initial state because setState doesn't exist yet
  const value = useMemo(
    () => ({
      ...state,
      setLocale,
    }),
    [setLocale, state],
  );
  return (
    <TranslationContext.Provider value={value}>
      {Children.only(children)}
    </TranslationContext.Provider>
  );
};
TranslationProvider.propTypes = {
  i18nProvider: PropTypes.object,
  children: PropTypes.element.isRequired,
};
TranslationProvider.defaultProps = {
  i18nProvider: null,
};
export default TranslationProvider;
