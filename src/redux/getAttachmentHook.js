import { useSelector } from 'react-redux';
import get from 'lodash/get';

export default (interview, id) => {
  return useSelector(state => {

    return {
      loading: get(state, `interview.attachments.${id}.loading`, false),
      value: get(state, `interview.attachments.${id}.value`)
    }
  });
}