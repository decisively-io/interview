import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import interviewReducer from './interviewReducer';
import interviewSaga from './interviewSaga';
import { all, fork } from 'redux-saga/effects';

const decCreateStore = ({
  dataProvider,
  authProvider = null,
  config = {}
}) => {
  const sagaMiddleware = createSagaMiddleware();
  const resettableAppReducer = (state, action) => interviewReducer(state, action);
  const saga = function* rootSaga() {
    yield all([
      interviewSaga(dataProvider, authProvider, config)
    ].map(fork));
  }
  const typedWindow = window;

  const store = createStore(
    resettableAppReducer,
    {},
    compose(
      applyMiddleware(
        sagaMiddleware,
      ),
      typeof typedWindow !== 'undefined'
        && typedWindow.__REDUX_DEVTOOLS_EXTENSION__
        ? typedWindow.__REDUX_DEVTOOLS_EXTENSION__()
        : (f) => f,
    )
  );
  sagaMiddleware.run(saga);
  return store;
}

export default decCreateStore;