import url from 'url';

export default (options = {}, authProvider) => {
  const checkStatus = function checkStatus(res) {
    if (res.ok) {
      return res;
    }
    throw (res);
  };

  const parseError = function parseError(err) {
    //console.log('err', err);

    if (err.json) {
      return err.json().then(errorMessage => {
        console.log('error', errorMessage);
        throw(errorMessage.message || 'Unknown server error');
      });
    } else throw(err);
  }

  const checkCookie = (res) => {
    let info = url.parse(res.url);
    const interviewId = info.path.substring(info.path.lastIndexOf('/') + 1);
    return res.json().then(body => {
      if (body.message) {
        // There was an error
        throw(body.message || 'Unknown server error');
      }
      const cookie = JSON.parse(localStorage.getItem('currentInterviews'));

      if (!cookie || !cookie[interviewId]) {
        if (body.screen.action === 'stop') return body; // Shouldn't have a cookie and then get a stop action (how did they call then?) - just in case

        let data = {};
        data[interviewId] = {
          session: body.session,
          currentScreen: body.goal,
          interviewId: body.interviewId
        }
        localStorage.setItem('currentInterviews', JSON.stringify(data));
      } else {
         if (body.screen.action === 'stop') {
          // Interview has finished. Remove cookie so they can start a new interview
          delete cookie[interviewId];
          localStorage.setItem('currentInterviews', JSON.stringify(cookie));
        } else {
          // Update existing cookie
          if (body.session) cookie[interviewId].session = body.session;
          if (body.goal) cookie[interviewId].currentScreen = body.goal;
          localStorage.setItem('currentInterviews', JSON.stringify(cookie));
        }
      }

      return body;
    });
  }

  const mapRequest = (type, params) => {
    const { host } = options;
    let baseUrl = host;

    if (type === 'finishInterview') {
      // TODO: Fix to only remove my current interview
      localStorage.removeItem('currentInterviews');

      return true;
    } else if (type === 'loadAttachment') {
      const { id, interview } = params;
      // Get cookie so we can get session id
      const cookie = JSON.parse(localStorage.getItem('currentInterviews')) || {};
      if (!cookie[interview] || !cookie[interview].session) throw 'No current interview';
      const session = cookie[interview].session;
      const interviewId = cookie[interview].interviewId;
      let url = `${baseUrl}/attachment/${id}`;

      // Okay now call back end
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          interview: interviewId,
          session: session
        })
      }).then(checkStatus).then((res) => res.json()).catch(parseError);
    } else if (type === 'loadLanguage') {
      const { lang, id } = params;
      let url = `${baseUrl}/i18n/${id}/${lang}`;

      return fetch(url, {
        method: 'GET'
      }).then(checkStatus).then((res) => res.json()).catch(parseError);
    } else {
      // A next or previous screen request
      const { id, data, goalState } = params;



      let url = `${baseUrl}/progress/${id}`;
      let body = {};

      const cookie = JSON.parse(localStorage.getItem('currentInterviews')) || {};
      if (cookie[id]) {
        // There is cookie data for this interview
      
        if (cookie[id].session) body.session = cookie[id].session;
        if (cookie[id].currentScreen) body.goal = cookie[id].currentScreen;
        if (cookie[id].interviewId) body.interviewId = cookie[id].interviewId;
      } // If there is no cookie data a new session will be generated for us
      // This method doesn't support having multiple of the same interview open

      if (type === 'nextScreen') {
        body = {...body, ...data};
      } else if (type === 'prevScreen') {
        body.goal = goalState;
      } 
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      }).then(checkStatus).then(checkCookie).catch(parseError);
    }
  };
  return (type, params) => mapRequest(type, params);
};