import { message } from 'antd';
import { getConfigAbout, getConfigLogin } from '@/services/api';

export default {
  namespace: 'about',

  state: {
    getabout: {},
    getlogin: {},
  },

  effects: {
    *getabout({ payload }, { call, put }) {
      const response = yield call(getConfigAbout, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getConfigAbout',
          payload: response.data,
        });
      } else {
        message.error('Hệ thống đang xảy ra lỗi !');
      }
    },
    *getlogin({ payload }, { call, put }) {
      const response = yield call(getConfigLogin, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getConfigLogin',
          payload: response.data,
        });
      } else {
        message.error('Hệ thống đang xảy ra lỗi !');
      }
    },
  },

  reducers: {
    getConfigAbout(state, action) {
      return {
        ...state,
        getabout: action.payload,
      };
    },
    getConfigLogin(state, action) {
      return {
        ...state,
        getlogin: action.payload,
      };
    },
  },
};
