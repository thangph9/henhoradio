/* eslint-disable no-shadow */
import { getMembers } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'members',

  state: {
    getmembers: [],
  },
  effects: {
    *getmembers({ payload }, { call, put }) {
      const response = yield call(getMembers, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getMembers',
          payload: response.data,
        });
      } else {
        message.error('Có lỗi xảy ra. Kiểm tra đường truyền hoặc đăng nhập lại');
      }
    },
  },
  reducers: {
    getMembers(state, action) {
      return {
        ...state,
        getmembers: action.payload,
      };
    },
  },
};
