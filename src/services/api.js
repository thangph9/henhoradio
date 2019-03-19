import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('http://localhost:8003/api/project/notice');
}

export async function queryActivities() {
  return request('http://localhost:8003/api/activities');
}

export async function queryRule(params) {
  return request(`http://localhost:8003/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('http://localhost:8003/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('http://localhost:8003/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`http://localhost:8003/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('http://localhost:8003/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('http://localhost:8003/api/fake_chart_data');
}

export async function queryTags() {
  return request('http://localhost:8003/api/tags');
}

export async function queryBasicProfile() {
  return request('http://localhost:8003/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('http://localhost:8003/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`http://localhost:8003/api/fake_list?${stringify(params)}`);
}
export async function trackList(params) {
  return request('http://localhost:8003/api/tracklist', {
    method: 'GET',
    body: params,
  });
}
export async function getDetailList(params) {
  return request('http://localhost:8003/api/detaillist', {
    method: 'GET',
    body: params,
  });
}
export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`http://localhost:8003/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`http://localhost:8003/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`http://localhost:8003/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('http://localhost:8003/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('http://localhost:8003/api/register', {
    method: 'POST',
    body: params,
  });
}
export async function getMembers(params) {
  return request('/api/members/getmembers', {
    method: 'GET',
    body: params,
  });
}
export async function loginAccount(params) {
  return request('/api/authentication/login', {
    method: 'POST',
    body: params,
  });
}
export async function RegisterAccount(params) {
  return request('http://localhost:8003/api/authentication/register', {
    method: 'POST',
    body: params,
  });
}
export async function questionRegister() {
  return request('http://localhost:8003/api/authentication/question', {
    method: 'GET',
  });
}
export async function checkUser(params) {
  return request(`http://localhost:8003/api/authentication/checkuser/${params}`, {});
}
export async function sendAnswer(params) {
  return request('http://localhost:8003/api/authentication/sendanswer', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function changePass(params) {
  return request('http://localhost:8003/api/authentication/changepass', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function updatePhone(params) {
  return request('http://localhost:8003/api/authentication/updatephone', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function updateEmail(params) {
  return request('http://localhost:8003/api/authentication/updateemail', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function getUser() {
  return request('http://localhost:8003/api/authentication/getuser', {
    method: 'GET',
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function getOnlyUser() {
  return request('http://localhost:8003/api/authentication/getonlyuser', {
    method: 'GET',
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function getUserById(params) {
  return request(`http://localhost:8003/api/authentication/getuserbyid/${params}`, {
    method: 'GET',
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function getAllUsers() {
  return request('http://localhost:8003/api/authentication/getallusers', {
    method: 'GET',
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function updateProfileUser(params) {
  return request('http://localhost:8003/api/authentication/updateprofileuser', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function updateProfileQuestion(params) {
  return request('http://localhost:8003/api/authentication/updateprofilequestion', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': JSON.parse(localStorage.getItem('token')) },
  });
}
export async function homeDemo() {
  return request('http://localhost:8003/api/authentication/homedemo');
}

export async function queryNotices(params = {}) {
  return request(`http://localhost:8003/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`http://localhost:8003/api/captcha?mobile=${mobile}`);
}
