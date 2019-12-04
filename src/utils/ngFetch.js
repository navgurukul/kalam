import axios from 'axios';
// import { useHistory } from "react-router-dom";
import history from './history';

const BASE_URL = process.env.API_URL;

export default async function ngFetch(url, method='GET', options={}, useAuth=true) {
  let opts = {
    url: `${BASE_URL}${url}`,
    method,
    ...options
  };
  if (useAuth) {
    const jwt = localStorage.getItem('jwt');
    if (opts.headers) {
      opts.headers["Authorization"] = jwt;
    } else {
      opts.headers = {
        'Authorization': jwt
      }
    }
  }
  try {
    const resp = await axios(opts);
    return resp;
  } catch (err) {
    console.log(err);
    if (err.response.status === 401) {
      localStorage.removeItem('jwt');
      history.push('/')
    }
  }
}