import { query as queryUsers, queryCurrent } from '@/services/user';
import { getSetting } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'user',
  state: {
    list: [],
    currentUser: {},
    getsetting: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *getsetting({ payload }, { call, put }) {
      const response = yield call(getSetting, payload);
      console.log('model:', response);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getSetting',
          payload: response.setting,
        });
      } else {
        message.error('Có lỗi xảy ra !');
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    getSetting(state, action) {
      return {
        ...state,
        getsetting: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
