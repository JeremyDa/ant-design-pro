import { query, remove, add, update } from '@/services/api';
import { message } from 'antd';

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
      yield put({
        type: 'new',
      });
    },
    *remove({ payload, callback }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(remove, { ...payload, ...pagination });
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
      yield put({
        type: 'delete',
      });
    },
    *update({ payload, callback }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(update, { ...payload, ...pagination });
      yield put({
        type: 'save',
        payload: response,
      });

      if (callback) callback();
      yield put({
        type: 'edit',
      });
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
    new() {
      message.success('保存成功');
    },
    edit(state) {
      message.success('更新成功');
      return state;
    },
    delete() {
      message.success('删除成功');
    },
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
