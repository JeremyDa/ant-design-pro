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
    *fetch({ payload, callback, success }, { call, put }) {
      // payload.showError = true;
      const response = yield call(query, payload);
      if(response.details){
        yield put({
          type: 'showError',
          payload: response,
        });
      }else{
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
        if(success){
          success();
        }
      }
      
    },
    *fetchExcel({ payload }, { call }) {
      // payload.showError = true;
      const response = yield call(query, payload);

      window.open(response.name);
      
    },
    *add({ payload, callback, success }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(add, { ...payload, ...pagination });

      if(response.details){
        yield put({
          type: 'showError',
          payload: response,
        });
      }else{
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
        if(success){
          success();
        }else{
          yield put({
            type: 'new',
          });
        }
      }

      
      
    },
    *remove({ payload, callback, success }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(remove, { ...payload, ...pagination });

      if(response.details){
        yield put({
          type: 'showError',
          payload: response,
        });
      }else{
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
        if(success){
          success();
        }else{
          yield put({
            type: 'delete',
          });
        }
      }
    },
    *update({ payload, callback, success }, { select, call, put }) {
      const pagination = yield select(state => state.table.data.pagination);
      const response = yield call(update, { ...payload, ...pagination });

      if(response.details){
        yield put({
          type: 'showError',
          payload: response,
        });
      }else{
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
        if(success){
          success();
        }else{
          yield put({
            type: 'edit'
          });
        }
      }

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
    showError(state, {payload}){
      message.error(payload.details);
      return {
        ...state,
      }
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
