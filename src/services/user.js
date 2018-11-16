import url from './url';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${url}/currentUser`, {
    method: 'POST',
    headers: {
      token: localStorage.getItem('token'),
    },
    body: {
      userName: localStorage.getItem('userName'),
      // method: 'get',
    },
  });
}
