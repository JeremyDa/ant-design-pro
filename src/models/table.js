import { query, remove, add, update } from '@/services/api';

export default {
  namespace: 'table',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchKV({ payload, callback }, { call, put }) {
      // payload.showError = false;
      const response = yield call(query, payload);
      yield put({
        type: 'saveKV',
        payload: response,
      });
      if (callback) callback();
    },
    *fetch({ payload, callback }, { call, put }) {
      // payload.showError = true;
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchExcel({ payload }, { call }) {
      // payload.showError = true;
      const response = yield call(query, payload);

      return window.open(response.name);
    },
    *add({ payload, callback }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(add, { ...payload, ...pagination });
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(remove, { ...payload, ...pagination });
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(update, { ...payload, ...pagination });
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *return({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *clean({ callback }, { put }) {
      yield put({
        type: 'clean',
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      if (action.payload.list) {
        return {
          ...state,
          data: action.payload,
        };
      }
      return {
        ...state,
        ...action.payload,
      };
    },
    saveKV(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    clean() {
      return {
        data: {
          list: [],
          pagination: {},
        },
      };
    },
  },
};
