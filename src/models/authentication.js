/* eslint-disable eqeqeq */
import { loginAccount, RegisterAccount } from '@/services/api';

export default {
  namespace: 'authentication',

  state: {
    login: {},
    register: {},
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginAccount, payload);
      if (response.status === 'ok') {
        // localStorage.token = JSON.stringify(response.currentAuthority.token);
        localStorage.token = JSON.stringify(response.token);
        localStorage['antd-pro-authority'] = 'member';
        yield put({
          type: 'loginAuthentication',
          payload: response || {},
        });
      } else {
        yield put({
          type: 'loginAuthentication',
          payload: response || {},
        });
      }
    },
    *register({ payload }, { call, put }) {
      const response = yield call(RegisterAccount, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'registerAuthentication',
          payload: response || {},
        });
      } else {
        yield put({
          type: 'registerAuthentication',
          payload: response || {},
        });
      }
    },
  },

  reducers: {
    loginAuthentication(state, action) {
      return {
        ...state,
        login: action.payload,
      };
    },
    registerAuthentication(state, action) {
      return {
        ...state,
        register: action.payload,
      };
    },
  },
};
