import request from '../utils/request';

const url = 'http://192.168.2.206:8011';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${url}/currentUser`);
}
