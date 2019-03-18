/* eslint-disable no-shadow */
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
import { message } from 'antd';
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
    getallusers: [],
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
      if (response && response.status === 'ok') {
        message.success('Thay đổi mật khẩu thành công !');
        yield put({
          type: 'changePass',
        });
      } else if (response && response.status === 'error0') {
        message.error('Mật khẩu cũ không chính xác !');
      } else {
        message.error('Có lỗi xảy ra !');
      }
    },
    *updatephone({ payload }, { call, put }) {
      const response = yield call(updatePhone, payload);
      if (response && response.status === 'ok') {
        message.success('Thay đổi dữ liệu thành công !');
        yield put({
          type: 'updatePhone',
          payload,
        });
      } else {
        message.error('Thao tác không thành công');
      }
    },
    *updateemail({ payload }, { call, put }) {
      const response = yield call(updateEmail, payload);
      if (response && response.status === 'ok') {
        message.success('Thay đổi thành công !');
        yield put({
          type: 'updateEmail',
          payload,
        });
      } else {
        message.error('Thay đổi không thành công !');
      }
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
      if (response && response.status === 'ok') {
        yield put({
          type: 'getUser',
          payload: response.data,
        });
      } else {
        message.error('Có lỗi xảy ra. Hãy thử đăng nhập lại !');
      }
    },
    *getonlyuser({ payload }, { call, put }) {
      const response = yield call(getOnlyUser, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getOnlyUser',
          payload: response.data,
        });
      } else {
        message.error('Có lỗi xảy ra. Hãy thử đăng nhập lại !');
      }
    },
    *getuserbyid({ payload }, { call, put }) {
      const response = yield call(getUserById, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getUserById',
          payload: response.data,
        });
      } else {
        message.error('Có lỗi xảy ra. Hãy thử đăng nhập lại !');
      }
    },
    *getallusers({ payload }, { call, put }) {
      const response = yield call(getAllUsers, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getAllUsers',
          payload: response.data,
        });
      } else {
        message.error('Có lỗi xảy ra. Hãy thử đăng nhập lại !');
      }
    },
    *updateprofilequestion({ payload }, { call, put }) {
      const response = yield call(updateProfileQuestion, payload);
      if (response && response.status === 'ok') {
        message.success('Thay đổi dữ liệu thành công !');
        yield put({
          type: 'updateProfileQuestion',
          payload,
        });
      } else {
        message.error('Thay đổi thất bại !');
      }
    },
    *updateprofileuser({ payload }, { call, put }) {
      const response = yield call(updateProfileUser, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'updateProfileUser',
          payload,
        });
        message.success('Thay đổi thông tin thành công !');
      } else {
        message.error('Có lỗi xảy ra !');
      }
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
      const newgetuser = state.getuser;
      const newgetuserbyid = state.getuserbyid;
      if (newgetuser.question) {
        const i = newgetuser.question.findIndex(
          element => element.question_id === action.payload.question_id
        );
        if (i === -1) {
          newgetuser.question.push({
            question_id: action.payload.question_id,
            answer: action.payload.answer,
          });
        } else {
          newgetuser.question[i] = {
            question_id: action.payload.question_id,
            answer: action.payload.answer,
          };
        }
      }
      const a = JSON.stringify(newgetuser);
      if (newgetuserbyid.question) {
        newgetuserbyid.yourQuestion.push({
          question_id: action.payload.question_id,
          answer: action.payload.answer,
        });
      }
      const b = JSON.stringify(newgetuserbyid);
      return {
        ...state,
        getuser: JSON.parse(a),
        getuserbyid: JSON.parse(b),
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
      const oldProps = state.getonlyuser;
      oldProps.address = action.payload.address;
      oldProps.gender = action.payload.gender;
      oldProps.dob_day = action.payload.dateinfo;
      oldProps.dob_month = action.payload.monthinfo;
      oldProps.dob_year = action.payload.yearinfo;
      oldProps.fullname = action.payload.fullname;
      oldProps.height = action.payload.height;
      oldProps.weight = action.payload.weight;
      oldProps.education = { education: action.payload.education };
      oldProps.jobs = { jobs: action.payload.jobs };
      oldProps.avatar = action.payload.avatar;
      const newProps = JSON.stringify(oldProps);
      return {
        ...state,
        getonlyuser: JSON.parse(newProps),
      };
    },
    changePass(state) {
      return {
        ...state,
      };
    },
    updatePhone(state, action) {
      const oldProps = state.getonlyuser;
      oldProps.phones = { '1': action.payload.phone };
      const a = JSON.stringify(oldProps);
      return {
        ...state,
        getonlyuser: JSON.parse(a),
      };
    },
    updateEmail(state, action) {
      const oldProps = state.getonlyuser;
      oldProps.email = action.payload.email;
      const a = JSON.stringify(oldProps);
      return {
        ...state,
        getonlyuser: JSON.parse(a),
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
