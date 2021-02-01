import { START_INTERVIEW_SUCCESS, NEXT_SCREEN_SUCCESS, PREV_SCREEN_SUCCESS, FINISH_INTERVIEW_SUCCESS, LOAD_ATTACHMENT_SUCCESS, LOAD_ATTACHMENT_LOADING, LOAD_ATTACHMENT_CANCEL, FETCH_START, FETCH_END, FETCH_ERROR, FETCH_CANCEL, LOAD_LANGUAGE_SUCCESS } from './interviewActions';

import set from 'lodash/set';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';

/**
 * Make the fetchedAt property non enumerable
 */
export const hideFetchedAt = (
  records,
) => {
  Object.defineProperty(records, 'fetchedAt', {
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return records;
};
const defaultCacheDuration = 10 * 60 * 1000; // ten minutes

/**
 * Returns a list of fetch dates by record id
 *
 * Given a list of new record ids and a previous list of fetch dates by record id,
 * add the new record ids at the current date,
 * and removes those among the old record ids that are stale.
 *
 * @param newRecordIds an array of record identifiers, e.g. [34, 56]
 * @param oldRecordFetchedAt the fetch dates of old records, e.g. { 12: new Date('12 minutes ago), 34: new Date('5 minutes ago') }
 * @param now Current time (useful for tests)
 * @param cacheDuration How long until an old record is removed from the list
 */
export const getFetchedAt = (
  newRecordIds = [],
  oldRecordFetchedAt = {},
  now = new Date(),
  cacheDuration = defaultCacheDuration,
) => {
  // prepare new records and timestamp them
  const newFetchedAt = {};
  newRecordIds.forEach((recordId) => (newFetchedAt[recordId] = now));

  // remove outdated entry
  const latestValidDate = new Date();
  latestValidDate.setTime(latestValidDate.getTime() - cacheDuration);

  const stillValidFetchedAt = pickBy(
    oldRecordFetchedAt,
    (date) => date > latestValidDate,
  );

  return {
    ...stillValidFetchedAt,
    ...newFetchedAt,
  };
};

/**
 * Add new records to the pool, and remove outdated ones.
 *
 * This is the equivalent of a stale-while-revalidate caching strategy:
 * The cached data is displayed before fetching, and stale data is removed
 * only once fresh data is fetched.
 */
export const addRecords = (
  newRecords = [],
  oldRecords,
) => {
  const newRecordsById = {};
  newRecords.forEach((record) => (newRecordsById[record.interviewId] = record));

  const newFetchedAt = getFetchedAt(
    newRecords.map(({ interviewId }) => interviewId),
    oldRecords.fetchedAt,
  );

  const records = { fetchedAt: newFetchedAt };
  Object.keys(newFetchedAt).forEach(
    (id) => (records[id] = newRecordsById[id] || oldRecords[id]),
  );

  return hideFetchedAt(records);
};

const initialState = {
  i18n: {}
};//hideFetchedAt({ fetchedAt: {} });

const interviewReducer = (previousState = initialState, { payload, type, meta, releaseId }) => {
  let curAttachments = previousState.attachments || {};
  switch (type) {
    case PREV_SCREEN_SUCCESS:
    case NEXT_SCREEN_SUCCESS:
    case START_INTERVIEW_SUCCESS:
      let newState = { ...previousState };
      set(newState, `${releaseId}.interview`, addRecords([payload], get(previousState, releaseId, hideFetchedAt({fetchedAt: {}}))))
      set(newState, `${releaseId}.lastActive`, payload.interviewId);
      return newState;
      /*return {
        ...previousState,

        screen: action.payload.screen,
        data: action.payload.data,
        progress: action.payload.progress,
        goal: action.payload.goal,
        i18n: action.payload.i18n
      }
    case NEXT_SCREEN_SUCCESS:
      return {
        screen: action.payload.screen,
        data: action.payload.data,
        progress: action.payload.progress,
        goal: action.payload.goal,
        i18n: action.payload.i18n
      }
    case PREV_SCREEN_SUCCESS:
      return {
        screen: action.payload.screen,
        data: action.payload.data,
        progress: action.payload.progress,
        goal: action.payload.goal,
        i18n: action.payload.i18n
      }*/
    case LOAD_LANGUAGE_SUCCESS:
      let newI18N = {...previousState.i18n};
      newI18N[payload.lang] = pick(payload.i18n, 'control', 'options', 'screen', 'stage');
      return {
        ...previousState,
        i18n: newI18N
      }
    case LOAD_ATTACHMENT_SUCCESS:
      set(curAttachments, `${action.payload.id}.loading`, false);
      set(curAttachments, `${action.payload.id}.value`, action.payload.value);

      return {
        ...previousState,
        ...{
          attachments: curAttachments
        }
      }
    case LOAD_ATTACHMENT_LOADING:
      set(curAttachments, `${action.payload.id}.loading`, true);
      return {
        ...previousState,
        ...{
          attachments: curAttachments
        }
      }
    case LOAD_ATTACHMENT_CANCEL:
      set(curAttachments, `${action.payload.id}.loading`, false);
      return {
        ...previousState,
        ...{
          attachments: curAttachments
        }
      }
    case FINISH_INTERVIEW_SUCCESS:
      return {};
    case FETCH_CANCEL:
    case FETCH_ERROR:
    case FETCH_END: 
      return {
        ...previousState,
        fetching: false
      }
    case FETCH_END:
      return {
        ...previousState,
        fetching: true
      }
    default:
      return previousState;
  }
};

export default interviewReducer;