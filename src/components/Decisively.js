import React from 'react';
import PropTypes from 'prop-types';
import createStore from '../redux/createStore';
import { Provider } from 'react-redux';
import InterviewProvider from '../dataProvider';
import { defaultI18nProvider, TranslationProvider } from '../i18n';
import slice from 'lodash/slice';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const Decisively = ({host, anonymous = true, authProvider, locale = 'en', i18nProvider, messages, children}) => {
  const dataProvider = InterviewProvider({
    host: host
  });
  
  const i18n = i18nProvider || defaultI18nProvider(locale, messages || {}, {
    allowMissing: true,
    onMissingKey: (t) => {
      // Remove the translation prefix
      let split = t.split('.');
      if (['options', 'stage', 'control', 'screen'].includes(split[0])) return slice(split, 1).join('.');
      else return t;
    }
  });

  const store = createStore({
    dataProvider,
    authProvider,
    locale: locale
  });
  return (
    <Provider store={store}>
      <TranslationProvider i18nProvider={i18n}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {children}
        </MuiPickersUtilsProvider>
      </TranslationProvider>
    </Provider>
  )
}
Decisively.propTypes = {
  host: PropTypes.string.isRequired
}

export default Decisively;