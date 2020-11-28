import { useSelector } from 'react-redux';
import get from 'lodash/get';

export default (releaseId, id) => {
  return useSelector(state => {
    if (id) return get(state, `${releaseId}.interview.${id}`);
    const lastActive = get(state, `${releaseId}.lastActive`);
    if (lastActive) {
      return get(state, `${releaseId}.interview.${lastActive}`);
    } else return;
  });
}