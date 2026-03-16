import { get, post } from '/@/utils/http/axios';

const URL = {
    list: '/api/order/list',
    create: '/api/order/create',
    submit: '/api/order/submit',
    payByPaymentNo: '/api/order/payByPaymentNo',
    update: '/api/order/update',
    delete: '/api/order/delete',
    cancel: '/api/order/cancelOrder',
    cancelUserOrder: '/api/order/cancelUserOrder',
    userOrderList: '/api/order/userOrderList',
}

const listApi = async (params) =>
    get({ url: URL.list, params: params, data: {}, headers: {} });
const userOrderListApi = async (params) =>
    get({ url: URL.userOrderList, params: params, data: {}, headers: {} });

const createApi = async (data) =>
    post({
        url: URL.create,
        params: {},
        data: data,
        headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
    });
const submitApi = async (params) =>
    post({ url: URL.submit, params: params, headers: {} });
const payByPaymentNoApi = async (params) =>
    post({ url: URL.payByPaymentNo, params: params, headers: {} });
const updateApi = async (params, data) =>
    post({
        url: URL.update,
        params: params,
        data: data,
        headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
    });
const updateStatusApi = async (params) =>
    post({ url: URL.update, params: params, headers: {} });
const deleteApi = async (params) =>
    post({ url: URL.delete, params: params, headers: {} });

const cancelApi = async (params) =>
    post({ url: URL.cancel, params: params, headers: {} });

const cancelUserOrderApi = async (params) =>
    post({ url: URL.cancelUserOrder, params: params, headers: {} });

export {
    listApi,
    userOrderListApi,
    createApi,
    submitApi,
    payByPaymentNoApi,
    updateApi,
    updateStatusApi,
    deleteApi,
    cancelApi,
    cancelUserOrderApi,
};
