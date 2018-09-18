import request from '../utils/request';

const url = 'http://106.12.24.238:8082';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${url}/currentUser`);
}
