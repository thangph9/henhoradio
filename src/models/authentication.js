import {
  loginAccount,
  RegisterAccount,
  homeDemo,
  checkUser,
  questionRegister,
} from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'authentication',

  state: {
    login: {},
    register: {},
    homedemo: {},
    checkuser: {},
    questionregister: {},
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginAccount, payload);
      if (response.status === 'ok') {
        localStorage.token = JSON.stringify(response.token);
        setAuthority(['member']);
        reloadAuthorized();
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
    *homedemo({ payload }, { call, put }) {
      const response = yield call(homeDemo, payload);
      yield put({
        type: 'home',
        payload: response || {},
      });
    },
    *register({ payload }, { call, put }) {
      const response = yield call(RegisterAccount, payload);
      yield put({
        type: 'registerAuthentication',
        payload: response || {},
      });
    },
    *checkuser({ payload }, { call, put }) {
      const response = yield call(checkUser, payload);
      yield put({
        type: 'checkUserAuthentication',
        payload: response || {},
      });
    },
    *questionregister({ payload }, { call, put }) {
      const response = yield call(questionRegister, payload);
      yield put({
        type: 'questionRegister',
        payload: response || {},
      });
    },
  },

  reducers: {
    loginAuthentication(state, action) {
      // return <Redirect to="/home" />; // eslint-disable-line

      return {
        ...state,
        login: action.payload,
      };
    },
    checkUserAuthentication(state, action) {
      return {
        ...state,
        checkuser: action.payload,
      };
    },
    registerAuthentication(state, action) {
      return {
        ...state,
        register: action.payload,
      };
    },
    home(state, action) {
      return {
        ...state,
        homedemo: action.payload,
      };
    },
    questionRegister(state, action) {
      return {
        ...state,
        questionregister: action.payload,
      };
    },
  },
};
