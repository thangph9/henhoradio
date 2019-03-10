import {
  loginAccount,
  RegisterAccount,
  homeDemo,
  checkUser,
  questionRegister,
  sendAnswer,
  getUser,
  updateProfileQuestion,
  getAllUsers,
  getUserById,
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
    sendanswer: {},
    getuser: {},
    updateprofilequestion: {},
    getallusers: {},
    getuserbyid: {},
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginAccount, payload);
      if (response.status === 'ok') {
        if (!localStorage.token) localStorage.token = JSON.stringify(response.token);
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
      localStorage.token = JSON.stringify(response.token);
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
    *sendanswer({ payload }, { call, put }) {
      const response = yield call(sendAnswer, payload);
      yield put({
        type: 'sendAnswer',
        payload: response || {},
      });
    },
    *getuser({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'getUser',
        payload: response || {},
      });
    },
    *getuserbyid({ payload }, { call, put }) {
      const response = yield call(getUserById, payload);
      yield put({
        type: 'getUserById',
        payload: response || {},
      });
    },
    *getallusers({ payload }, { call, put }) {
      const response = yield call(getAllUsers, payload);
      yield put({
        type: 'getAllUsers',
        payload: response || {},
      });
    },
    *updateprofilequestion({ payload }, { call, put }) {
      const response = yield call(updateProfileQuestion, payload);
      yield put({
        type: 'updateProfileQuestion',
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
    sendAnswer(state, action) {
      return {
        ...state,
        sendanswer: action.payload,
      };
    },
    getUser(state, action) {
      return {
        ...state,
        getuser: action.payload,
      };
    },
    updateProfileQuestion(state, action) {
      return {
        ...state,
        updateprofilequestion: action.payload,
      };
    },
    getAllUsers(state, action) {
      return {
        ...state,
        getallusers: action.payload,
      };
    },
    getUserById(state, action) {
      return {
        ...state,
        getuserbyid: action.payload,
      };
    },
  },
};
