// 权限问题后期增加
import { get, post } from '/@/utils/http/axios';
// import axios from 'axios';
const URL = {
    userLogin: '/api/user/userLogin',
    adminLogin: '/api/user/adminLogin',
    list: '/api/user/list',
    create: '/api/user/create',
    update: '/api/user/update',
    delete: '/api/user/delete',
    detail: '/api/user/detail',
};

const userLoginApi = async (data) => post({ url: URL.userLogin, data: data, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } }); // 用户登录
const loginApi = async (data) => post({ url: URL.adminLogin, data: data, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } }); // 管理员登录
const listApi = async (params) => get({ url: URL.list, params: params, data: {}, headers: {} }); // 用户列表
const createApi = async (data) => post({ url: URL.create, params: {}, data: data, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } }); // 新增用户
const updateApi = async (data) => post({ url: URL.update, data: data, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } }); // 更新用户
const deleteApi = async (params) => post({ url: URL.delete, params: params, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } }); // 删除用户
const detailApi = async (params) => get({ url: URL.detail, params: params, headers: {} }); // 用户详情

const userRegisterApi = createApi;
const updateUserInfoApi = updateApi;
const updateUserPwdApi = updateApi;

export {
    userLoginApi,
    loginApi,
    listApi,
    createApi,
    updateApi,
    deleteApi,
    detailApi,
    userRegisterApi,
    updateUserInfoApi,
    updateUserPwdApi
};
