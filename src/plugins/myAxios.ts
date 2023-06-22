import axios from "axios";
//拦截器请求后端地址
const instance = axios.create({
  baseURL: "http://localhost:8101/api/",
  timeout: 1000,
  headers: {},
});

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const data = response.data;
    if (data.code === 0) {
      return data.data; //响应数据
    }
    console.error("request error", data); //打印错误信息到控制台
    return response.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
export default instance; //导出
