export const START_INTERVIEW = 'DP/INTERVIEW/START_INTERVIEW';
export const START_INTERVIEW_SUCCESS = 'DP/INTERVIEW/START_INTERVIEW_SUCCESS';

export const startInterview = (id) => ({
  type: START_INTERVIEW,
  payload: {
    id
  }
});

export const NEXT_SCREEN = 'DP/INTERVIEW/NEXT_SCREEN';
export const NEXT_SCREEN_SUCCESS = 'DP/INTERVIEW/NEXT_SCREEN_SUCCESS';
export const nextScreen = (id, data) => ({
  type: NEXT_SCREEN,
  payload: {
    id,
    data
  }
});


export const PREV_SCREEN = 'DP/INTERVIEW/PREV_SCREEN';
export const PREV_SCREEN_SUCCESS = 'DP/INTERVIEW/PREV_SCREEN_SUCCESS';
export const prevScreen = (id, goalState) => ({
  type: PREV_SCREEN,
  payload: {
    id,
    goalState
  }
});

export const FINISH_INTERVIEW = 'DP/INTERVIEW/FINISH_INTERVIEW';
export const FINISH_INTERVIEW_SUCCESS = 'DP/INTERVIEW/FINISH_INTERVIEW_SUCCESS';
export const finishInterview = (id, redirect) => ({
  type: FINISH_INTERVIEW,
  payload: {
    id,
    redirect
  }
});

export const LOAD_ATTACHMENT = 'DP/INTERVIEW/LOAD_ATTACHMENT';
export const LOAD_ATTACHMENT_SUCCESS = 'DP/INTERVIEW/LOAD_ATTACHMENT_SUCCESS';
export const LOAD_ATTACHMENT_CANCEL = 'DP/INTERVIEW/LOAD_ATTACHMENT_CANCEL';
export const LOAD_ATTACHMENT_LOADING = 'DP/INTERVIEW/LOAD_ATTACHMENT_LOADING';
export const loadAttachment = (interview, id) => ({
  type: LOAD_ATTACHMENT,
  payload: {
    id,
    interview
  }
});

export const FETCH_START = 'DP/FETCH_START';
export const fetchStart = () => ({
  type: FETCH_START,
});
export const FETCH_END = 'DP/FETCH_END';
export const fetchEnd = () => ({
  type: FETCH_END,
});
export const FETCH_ERROR = 'DP/FETCH_ERROR';
export const fetchError = () => ({
  type: FETCH_ERROR,
});
export const FETCH_CANCEL = 'DP/FETCH_CANCEL';
export const fetchCancel = () => ({
  type: FETCH_CANCEL,
});

export const SHOW_NOTIFICATION = 'DP/SHOW_NOTIFICATION';
export const showNotification = (message, type = 'info', notificationOptions) => ({
  type: SHOW_NOTIFICATION,
  payload: {
    ...notificationOptions,
    type,
    message,
  },
});

export const HIDE_NOTIFICATION = 'DP/HIDE_NOTIFICATION';
export const hideNotification = () => ({
  type: HIDE_NOTIFICATION,
});



