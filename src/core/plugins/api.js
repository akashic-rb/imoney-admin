import Axios from "axios";
import store from "@/core/store";
const baseURL = "http://employeesmanagement.test";
const api = Axios.create({ baseURL: baseURL });
api.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
