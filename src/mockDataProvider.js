import url from 'url';

export default (mockData={}) => {
  const mapRequest = (type, params) => {
    const { host } = options;
    let baseUrl = host;

    if (type === 'finishInterview') {
      return true;
    } else if (type === 'loadAttachment') {
      // Not supported in mock
      return Promise.resolve();
    } else if (type === 'loadLanguage') {
      if (get(mockData, `i18n.${id}.${land}`)) {
        let data = Object.values(get(mockData, `i18n.${id}.${land}`));
        return Promise.resolve(data);
      } else return Promise.reject(new Error('Language not found'));
    } else {
      // TODO
      return Promise.resolve();
    }
  };
  return (type, params) => mapRequest(type, params);
};