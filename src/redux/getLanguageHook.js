import { useSelector } from 'react-redux';
import get from 'lodash/get';

export default (lang) => {
  return useSelector(state => {
    return get(state, `i18n.${lang}`);
  });
}