import Vue from 'vue'
import axios from 'axios'

// 创建一个实例
const api = axios.create({
    baseURL: 'https://sandbox-api.estudy.chanke.xyz'
})

// 配置post请求默认请求头
api.defaults.headers.post['Content-Type'] = 'application/json';

// 配置响应拦截器
api.interceptors.response.use(response => {
    return response.data.data;
}, error => {
    const response = error.response;
    const config = error.config;
    if (!config._slient) {
        Vue.$notification.error({
            message: 'API Error',
            description: response.data.errorMessage
        })
    }
    return Promise.reject(error);
})

export default api