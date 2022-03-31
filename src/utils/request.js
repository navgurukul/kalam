const parseJSON = (response) => {
  if (response.status === 204 || response.status === 205) return null;
  return response.json();
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) return response;
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

export default (url, options) =>
  fetch(url, options).then(checkStatus).then(parseJSON);
