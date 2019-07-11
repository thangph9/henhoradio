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
  getDetailList,
  changeCare,
  getUserCare,
  getUserWhoCare,
} from '@/services/api';
import { notification } from 'antd';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 3,
});
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
    getdetaillist: [],
    changecare: {},
    getusercare: [],
    getuserwhocare: [],
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginAccount, payload);
      if (response.status === 'ok') {
        localStorage.token = JSON.stringify(response.token);
        setAuthority(response.rule);
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
      setAuthority(response.rule);
      reloadAuthorized();
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
        notification.success({ message: 'Thay đổi mật khẩu thành công!' });
        yield put({
          type: 'changePass',
        });
      } else if (response && response.status === 'error0') {
        notification.error({ message: 'Mật khẩu cũ không chính xác!' });
      } else {
        notification.error({ message: 'Có lỗi xảy ra!' });
      }
    },
    *updatephone({ payload }, { call, put }) {
      const response = yield call(updatePhone, payload);
      if (response && response.status === 'ok') {
        notification.success({ message: 'Thay đổi dữ liệu thành công!' });
        yield put({
          type: 'updatePhone',
          payload,
        });
      } else {
        notification.error({ messsage: 'Thao tác không thành công' });
      }
    },
    *updateemail({ payload }, { call, put }) {
      const response = yield call(updateEmail, payload);
      if (response && response.status === 'ok') {
        notification.success({ message: 'Thay đổi thành công !' });
        yield put({
          type: 'updateEmail',
          payload,
        });
      } else {
        notification.error({ message: 'Thay đổi không thành công!' });
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
          payload: response.data || {},
        });
      } else {
        notification.error({ message: 'Có lỗi xảy ra. Hãy thử đăng nhập lại!' });
      }
    },
    *getusercare({ payload }, { call, put }) {
      const response = yield call(getUserCare, payload);
      // console.log(response);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getUserCare',
          payload: response.data || [],
        });
      } else {
        yield put({
          type: 'getUserCare',
          payload: [],
        });
      }
    },
    *getuserwhocare({ payload }, { call, put }) {
      const response = yield call(getUserWhoCare, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getUserWhoCare',
          payload: response.data || [],
        });
      } else {
        notification.error({ message: 'Có lỗi xảy ra. Hãy thử đăng nhập lại!' });
      }
    },
    *getonlyuser({ payload }, { call, put }) {
      const response = yield call(getOnlyUser, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getOnlyUserReducer',
          payload: response.data || {},
        });
      } else {
        notification.error({ message: 'Có lỗi xảy ra. Hãy thử đăng nhập lại!' });
      }
    },
    *getdetaillist({ payload }, { call, put }) {
      const response = yield call(getDetailList, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getDetailList',
          payload: response.data || [],
        });
      }
    },
    *getuserbyid({ payload }, { call, put }) {
      const response = yield call(getUserById, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getUserById',
          payload: response.data || {},
        });
      }
    },
    *getallusers({ payload }, { call, put }) {
      const response = yield call(getAllUsers, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'getAllUsers',
          payload: response.data || [],
        });
      }
    },
    *updateprofilequestion({ payload }, { call, put }) {
      const response = yield call(updateProfileQuestion, payload);
      if (response && response.status === 'ok') {
        notification.success({ message: 'Thay đổi dữ liệu thành công!' });
        yield put({
          type: 'updateProfileQuestion',
          payload,
        });
      } else {
        notification.error({ message: 'Thao tác thất bại! ' });
      }
    },
    *changecare({ payload }, { call, put }) {
      const response = yield call(changeCare, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'changeCare',
          payload,
        });
        notification.success({
          message: payload.care ? 'Bạn đã quan tâm' : 'Bạn đã bỏ quan tâm',
        });
      } else {
        notification.error({ message: 'Thao tác thất bại!' });
      }
    },
    *updateprofileuser({ payload }, { call, put }) {
      const response = yield call(updateProfileUser, payload);
      if (response && response.status === 'ok') {
        const { status } = response;
        yield put({
          type: 'updateProfileUser',
          payload: { ...payload, status },
        });
      } else {
        notification.error({ message: 'Thao tác thất bại!' });
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
    changeCare(state, action) {
      const oldGetUserById = state.getuserbyid;
      const a = JSON.stringify(oldGetUserById);
      const b = JSON.parse(a);
      b.care = action.payload.care;
      const oldGetUserCare = state.getusercare;
      const c = JSON.stringify(oldGetUserCare);
      const d = JSON.parse(c);
      let arr = [];
      const temp = d.find(v => v.user_id === action.payload.user_id);
      if (temp) arr = d.filter(v => v.user_id !== action.payload.user_id);
      else if (action.payload.type === 'user') {
        const obj = {};
        obj.address = action.payload.address;
        obj.age = action.payload.age;
        obj.created = action.payload.created;
        obj.gender = action.payload.gender;
        obj.name = action.payload.name;
        obj.user_id = action.payload.user_id;
        obj.type = action.payload.type;
        d.push(obj);
        arr = d;
      } else {
        const obj = {};
        obj.address = action.payload.address;
        obj.location = action.payload.location;
        obj.created = action.payload.created;
        obj.gender = action.payload.gender;
        obj.name = action.payload.name;
        obj.user_id = action.payload.user_id;
        obj.type = action.payload.type;
        obj.timeup = action.payload.timeup;
        d.push(obj);
        arr = d;
      }
      // console.log(arr);
      return {
        ...state,
        getuserbyid: b,
        getusercare: arr,
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
      oldProps.hobbys = { hobbys: action.payload.hobbys };
      oldProps.assets = { assets: action.payload.assets };
      oldProps.marriage = action.payload.marriage;
      oldProps.hometown = action.payload.hometown;
      oldProps.avatar = action.payload.avatar;
      oldProps.active_friend = action.payload.active_friend;
      oldProps.location = action.payload.location;
      oldProps.vov = action.payload.vov;
      oldProps.status = action.payload.status;
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
    getOnlyUserReducer(state, action) {
      return {
        ...state,
        getonlyuser: action.payload,
      };
    },
    getUserCare(state, action) {
      return {
        ...state,
        getusercare: action.payload,
      };
    },
    getUserWhoCare(state, action) {
      return {
        ...state,
        getuserwhocare: action.payload,
      };
    },
    getDetailList(state, action) {
      return {
        ...state,
        getdetaillist: action.payload,
      };
    },
  },
};
