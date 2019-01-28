/* eslint-disable eqeqeq */
import { loginAccount } from '@/services/api';

export default {
  namespace: 'authentication',

  state: {
    login: {},
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginAccount, payload);
      if (response.status === 'ok') {
        localStorage.token = JSON.stringify(response.currentAuthority.token);
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
  },

  reducers: {
    loginAuthentication(state, action) {
      return {
        ...state,
        login: action.payload,
      };
    },
  },
};
