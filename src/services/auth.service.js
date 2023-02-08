import { fetchWrapper } from '../helpers/fetch-wrapper';

import axios from 'axios';
import { setCookie } from './../helpers';
const apiUrl = process.env.REACT_APP_API_ENDPOINT;

export async function login(email, password) {
  return axios
    .post(`${apiUrl}auth/login`, {
      email,
      password,
    })
    .then(response => {
      if (response.data.token) {
        localStorage.setItem(process.env.REACT_APP_AUTH, JSON.stringify(response.data));
      }
      console.log(response.data);
      return response.data;
    });
}

export async function signup(data) {
  return axios.post(`${apiUrl}auth/signup`, data);
}

export async function postNewEmail(id, data) {
  return fetchWrapper.post(`${apiUrl}auth/new-email/${id}`, data);
}

export async function changePassword(id, data) {
  return fetchWrapper.post(`${apiUrl}auth/change-password/${id}`, data);
}

export async function cancelProfile(id, data) {
  return fetchWrapper.post(`${apiUrl}auth/profile-cancel/${id}`, data);
}

export async function profile(id, data) {
  return fetchWrapper.patch(`${apiUrl}auth/${id}`, data);
}

export async function getSubscription(id) {
  return fetchWrapper.get(`${apiUrl}auth/subscription/${id}`);
}

export async function getInvoices(id) {
  return fetchWrapper.get(`${apiUrl}auth/invoices/${id}`);
}

export async function subscription(id, data) {
  return fetchWrapper.post(`${apiUrl}auth/subscription/${id}`, data);
}

export async function subscriptionCancel(id) {
  return fetchWrapper.delete(`${apiUrl}auth/subscription/${id}`);
}

export async function forgottpassword(email) {
  return axios.post(`${apiUrl}auth/forgotten`, {
    email,
  });
}

export async function newpassword(hash, newPwd) {
  return axios.post(`${apiUrl}auth/new-password`, {
    hash,
    newPwd,
  });
}

export async function confirmemail(hash) {
  return axios.post(`${apiUrl}auth/confirm-email`, {
    hash,
  });
}

export async function confirmSubscriptionCancel(uid, hash) {
  return axios.post(`${apiUrl}auth/confirm-subscription-cancel`, {
    uid,
    hash,
  });
}

export async function confirmProfileCancel(uid, hash) {
  return axios.post(`${apiUrl}auth/apply-profile-cancel/${uid}/${hash}`);
}

export function logout() {
  localStorage.removeItem(process.env.REACT_APP_AUTH);
  history.push('/signin');
}

export async function me() {
  return fetchWrapper.get(`${apiUrl}auth/me`, {});
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(process.env.REACT_APP_AUTH));
}

export default {
  login,
  signup,
  forgottpassword,
  newpassword,
  confirmemail,
  logout,
  me,
  getCurrentUser,
};
