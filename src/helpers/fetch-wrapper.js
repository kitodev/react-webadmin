import { store, authActions } from '../store';
import axios from 'axios';

export const fetchWrapper = {
  get: get,
  post: post,
  patch: patch,
  put: put,
  delete: del,
  head: head,
};

const apiUrl = process.env.REACT_APP_API_ENDPOINT;

function api() {
  let headers = {
    Accept: 'application/json',
  };
  headers = Object.assign(headers, authHeader());
  return axios.create({ baseURL: apiUrl, timeout: 31000, headers: headers });
}

function request(method) {
  switch (method) {
    case 'get':
      return api().get;
      break;
    case 'post':
      return api().post;
      break;
    case 'patch':
      return api().patch;
      break;
    case 'put':
      return api().put;
      break;
    case 'delete':
      return api().delete;
      break;
    default:
      return api().head;
  }
}

function response(promise, resolve) {
  promise
    .then(response => {
      if (response.statusText.toLowerCase() !== 'ok') {
        if ([401, 403].includes(response.status) && authToken()) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          const logout = () => store.dispatch(authActions.logout());
          logout();
          throw new Error('Unauthorized');
        }
        response = null;
      }
      if (resolve) {
        resolve(response);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function get(url, params, resolve) {
  const promise = request('get')(url, { params });
  response(promise, resolve);
  return promise;
}

function post(url, data, resolve) {
  const promise = request('post')(url, data);
  response(promise, resolve);
  return promise;
}

function patch(url, data, resolve) {
  const promise = request('patch')(url, data);
  response(promise, resolve);
  return promise;
}

function put(url, data, resolve) {
  const promise = request('put')(url, data);
  response(promise, resolve);
  return promise;
}

function del(url, params, resolve) {
  const promise = request('delete')(url, { params });
  response(promise, resolve);
  return promise;
}

function head(url, params, resolve) {
  const promise = request('head')(url, { params });
  response(promise, resolve);
  return promise;
}

// helper functions

function authHeader() {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = authToken();
  const isLoggedIn = !!token;
  if (isLoggedIn) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function authToken() {
  return store.getState().auth.user?.token;
}
