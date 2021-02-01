import React from 'react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import mockInterviewProvider from './mockDataProvider';
import createStore from './redux/createStore';
import {Button} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { defaultI18nProvider, TranslationProvider } from './i18n';
import slice from 'lodash/slice';

/*import mediaQuery from 'css-mediaquery';

function createMatchMedia(width) {
  return query => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}*/


const AllTheProviders = ({ children, mockData = {}, messages={}, locale='en'}) => {
  const dataProvider = mockInterviewProvider(mockData);
  const store = createStore({
    dataProvider : dataProvider,
    authProvider : null,
    locale: locale || 'en'
  });

  const i18n = defaultI18nProvider(locale, messages, {
    allowMissing: true,
    onMissingKey: (t) => {
      // Remove the translation prefix
      let split = t.split('.');
      if (['options', 'stage', 'control', 'screen'].includes(split[0])) return slice(split, 1).join('.');
      else return t;
    }
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
const FormProvider = ({children, formRecord, submitHandler, ...other}) => {
  return (
    <AllTheProviders {...other}>
      <Formik initialValues={formRecord} onSubmit={submitHandler}>
        { formik => (
          <form onSubmit={formik.handleSubmit}>
            {children}
            <Button type="submit" >Submit</Button>
          </form>
        )}
      </Formik>
    </AllTheProviders>
  )
}

export const formRender = (ui, options = {}) =>
  render(ui, { 
    wrapper: props => <FormProvider {...options} {...props} />, ...options })


const customRender = (ui, options = {}) =>
  render(ui, { 
    wrapper: props => <AllTheProviders {...options} {...props} />, ...options })

// re-export everything
export * from '@testing-library/react'


// override render method
export { customRender as render }
//export { createMatchMedia as createMatchMedia}
