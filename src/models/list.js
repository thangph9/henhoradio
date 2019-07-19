import {
  queryFakeList,
  removeFakeList,
  addFakeList,
  updateFakeList,
  trackList,
  fetchDataAPIPublic,
} from '@/services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
    tracklist: [],
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },

    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *tracklist({ payload }, { call, put }) {
      const response = yield call(trackList, payload);
      yield put({
        type: 'trackList',
        payload: response.data || [],
      });
    },
    *fetchPublicDataAPI({ payload }, { call, put }) {
      const response = yield call(fetchDataAPIPublic, payload);
      yield put({
        type: 'fetchAPIPublicData',
        payload: response.data || [],
      });
    },
  },

  reducers: {
    fetchAPIPublicData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    trackList(state, action) {
      return {
        ...state,
        tracklist: action.payload,
      };
    },
  },
};
