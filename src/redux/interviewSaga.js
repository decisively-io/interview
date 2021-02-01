import { all, put, cancelled, call, takeEvery } from 'redux-saga/effects';
import { FETCH_CANCEL,
  FETCH_END,
  FETCH_ERROR,
  FETCH_START,
  SHOW_NOTIFICATION,
  START_INTERVIEW, START_INTERVIEW_SUCCESS, NEXT_SCREEN, NEXT_SCREEN_SUCCESS, PREV_SCREEN, PREV_SCREEN_SUCCESS, FINISH_INTERVIEW, FINISH_INTERVIEW_SUCCESS, LOAD_ATTACHMENT, LOAD_ATTACHMENT_SUCCESS, LOAD_ATTACHMENT_CANCEL, LOAD_ATTACHMENT_LOADING, LOAD_LANGUAGE, LOAD_LANGUAGE_SUCCESS
} from './interviewActions';
import { push } from 'connected-react-router';

const startInterview = function* startInterview (provider, action) {

  const { payload } = action;
  try {
    yield all([
      put({ type: FETCH_START }),
    ]);
    const response = yield call(provider, 'startInterview', payload);
    yield put({
      type: START_INTERVIEW_SUCCESS,
      releaseId: payload.id,
      payload: response
    })
    yield put({ type: FETCH_END });

  } catch (error) {
    console.log('caught error', error);
    yield put({ type: FETCH_ERROR, error });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_CANCEL });
    }
  }
}

const nextScreen = function* nextScreen (provider, action) {
  const { payload } = action;

  try {
    yield all([
      put({ type: FETCH_START }),
    ]);
    const response = yield call(provider, 'nextScreen', payload);
    yield put({
      type: NEXT_SCREEN_SUCCESS,
      releaseId: payload.id,
      payload: response
    })
    yield put({ type: FETCH_END });

  } catch (error) {
    console.log('caught error', error);
    yield put({ 
      type: SHOW_NOTIFICATION, 
      payload: {
        message: error,
        type: 'error',
      }
    });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_CANCEL });
    }
  }
}


const prevScreen = function* prevScreen (provider, action) {
  const { payload } = action;

  try {
    yield all([
      put({ type: FETCH_START }),
    ]);
    const response = yield call(provider, 'prevScreen', payload);
    yield put({
      type: PREV_SCREEN_SUCCESS,
      releaseId: payload.id,
      payload: response
    })
    yield put({ type: FETCH_END });

  } catch (error) {
    console.log('caught error', error);
    yield put({ 
      type: SHOW_NOTIFICATION, 
      payload: {
        message: error,
        type: 'error',
      }
    });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_CANCEL });
    }
  }
}

const loadLanguage = function* loadLanguage (provider, action) {
  const { lang, id } = action;
  try {
    yield all([
      put({ type: FETCH_START }),
    ]);
    const response = yield call(provider, 'loadLanguage', {lang, id});
    yield put({
      type: LOAD_LANGUAGE_SUCCESS,
      payload: {
        releaseId: id,
        lang: lang,
        i18n: response
      }
    })
    yield put({ type: FETCH_END });

  } catch (error) {
    yield put({ 
      type: SHOW_NOTIFICATION, 
      payload: {
        message: error,
        type: 'error',
      }
    });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_CANCEL });
    }
  }
}

const loadAttachment = function* loadAttachment (provider, action) {
  const { payload } = action;
  try {
    yield put({ type: LOAD_ATTACHMENT_LOADING, payload });
    const response = yield call(provider, 'loadAttachment', payload);
    yield put({
      type: LOAD_ATTACHMENT_SUCCESS,
      payload: response
    });
  } catch (error) {
    yield put({ 
      type: SHOW_NOTIFICATION, 
      payload: {
        message: error.message,
        type: 'error',
      }
    });
  } finally {
    if (yield cancelled()) {
      yield put({ type: LOAD_ATTACHMENT_CANCEL, payload});
    }
  }
}

const finishInterview = function* finishInterview (provider, action) {
  const { payload } = action;
  try {
    yield call(provider, 'finishInterview', payload);
    yield put({
      type: FINISH_INTERVIEW_SUCCESS
    });
    yield put(
      push(payload.redirect || '/')
    );
  } catch (error) {
    yield put({ 
      type: SHOW_NOTIFICATION, 
      payload: {
        message: error,
        type: 'error',
      }
    });
  }
}

/*
const interviewSaga = function* watchInterviewActions(provider) {
  yield all([
    takeEvery(START_INTERVIEW, startInterview, provider)
  ]);
}*/

export default (provider) => function* interview() {
  yield all([
    takeEvery(START_INTERVIEW, startInterview, provider),
    takeEvery(NEXT_SCREEN, nextScreen, provider),
    takeEvery(PREV_SCREEN, prevScreen, provider),
    takeEvery(FINISH_INTERVIEW, finishInterview, provider),
    takeEvery(LOAD_ATTACHMENT, loadAttachment, provider),
    takeEvery(LOAD_LANGUAGE, loadLanguage, provider)
  ]);
};