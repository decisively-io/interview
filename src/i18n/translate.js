import React from 'react';
import useTranslate from './useTranslate';
import useLocale from './useLocale';

/**
 * Higher-Order Component for getting access to the `locale` and the `translate` function in props.
 *
 * Requires that the app is decorated by the <TranslationProvider> to inject
 * the translation dictionaries and function in the context.
 *
 * @example
 *     import React from 'react';
 *     import { translate } from 'react-admin';
 *
 *     const MyHelloButton = ({ translate }) => (
 *         <button>{translate('myroot.hello.world')}</button>
 *     );
 *
 *     export default translate(MyHelloButton);
 *
 * @param {*} BaseComponent The component to decorate
 */
const withTranslate = (BaseComponent) => {
  const TranslatedComponent = (props) => {
    const translate = useTranslate();
    const locale = useLocale();

    return (
      <BaseComponent translate={translate} locale={locale} {...props} />
    );
  };

  TranslatedComponent.defaultProps = BaseComponent.defaultProps;

  return TranslatedComponent;
};

export default withTranslate;
