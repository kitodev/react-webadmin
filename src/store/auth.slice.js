import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history } from '../helpers/history';
import { fetchWrapper } from '../helpers/fetch-wrapper';

// create slice

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem(process.env.REACT_APP_AUTH)),
    scope: localStorage.getItem(process.env.REACT_APP_SCOPE) ?? null,
    error: null,
  };
}

function createReducers() {
  return {
    signin,
    logout,
    changeScope,
  };

  function signin(state, reducer) {
    state.user = reducer.payload;
    localStorage.setItem(process.env.REACT_APP_AUTH, JSON.stringify(state.user));
    if (state.user?.user?.permissions[0]) {
      state.scope = state.user.user.permissions[0];
      localStorage.setItem(process.env.REACT_APP_SCOPE, state.scope);
    }
  }

  function logout(state) {
    state.user = null;
    state.scope = null;
    localStorage.removeItem(process.env.REACT_APP_AUTH);
    localStorage.removeItem(process.env.REACT_APP_SCOPE);
    history.navigate('/signin');
  }

  function changeScope(state, reducer) {
    state.scope = reducer.payload;
    localStorage.setItem(process.env.REACT_APP_SCOPE, state.scope);
    // history.navigate('/');
  }
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_ENDPOINT}auth`;

  return {
    login: login(),
  };

  function login() {
    return createAsyncThunk(
      `${name}/login`,
      async ({ email, password, socialProvider, socialData }, { rejectWithValue }) => {
        try {
          const response = await fetchWrapper.post(`${baseUrl}/login`, {
            email,
            password,
            socialProvider,
            socialData,
          });
          return response;
        } catch (err) {
          return rejectWithValue(err);
        }
      },
    );
  }
}

function createExtraReducers() {
  return {
    ...login(),
  };

  function login() {
    const { pending, fulfilled, rejected } = extraActions.login;
    return {
      [pending]: state => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const response = action.payload;
        const user = response.data;

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(process.env.REACT_APP_AUTH, JSON.stringify(user));
        state.user = user;

        if (state.user?.user?.permissions[0]) {
          state.scope = state.user.user.permissions[0];
          localStorage.setItem(process.env.REACT_APP_SCOPE, state.scope);
        }

        // get return url from location state or default to home page
        const { from } = history?.location?.state || { from: { pathname: '/' } };
      },
      [rejected]: (state, action) => {
        state.error = action.error;
      },
    };
  }
}
