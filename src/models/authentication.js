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
  updateProfileUser,
  changePass,
  updatePhone,
  updateEmail,
  getOnlyUser,
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
    updateprofileuser: {},
    changepass: {},
    updatephone: {},
    updateemail: {},
    getonlyuser: {},
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
    *changepass({ payload }, { call, put }) {
      const response = yield call(changePass, payload);
      yield put({
        type: 'changePass',
        payload: response || {},
      });
    },
    *updatephone({ payload }, { call, put }) {
      const response = yield call(updatePhone, payload);
      yield put({
        type: 'updatePhone',
        payload: response || {},
      });
    },
    *updateemail({ payload }, { call, put }) {
      const response = yield call(updateEmail, payload);
      yield put({
        type: 'updateEmail',
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
    *getonlyuser({ payload }, { call, put }) {
      const response = yield call(getOnlyUser, payload);
      yield put({
        type: 'getOnlyUser',
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
    *updateprofileuser({ payload }, { call, put }) {
      const response = yield call(updateProfileUser, payload);
      yield put({
        type: 'updateProfileUser',
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
    updateProfileUser(state, action) {
      return {
        ...state,
        updateprofileuser: action.payload,
      };
    },
    changePass(state, action) {
      return {
        ...state,
        changepass: action.payload,
      };
    },
    updatePhone(state, action) {
      return {
        ...state,
        updatephone: action.payload,
      };
    },
    updateEmail(state, action) {
      return {
        ...state,
        updateemail: action.payload,
      };
    },
    getOnlyUser(state, action) {
      return {
        ...state,
        getonlyuser: action.payload,
      };
    },
  },
};
