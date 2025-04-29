import axios from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response);
    } else if (error.request) {
      return Promise.reject({
        message: "No response received from server.",
      });
    } else {
      return Promise.reject({
        message: "An unexpected error occurred.",
      });
    }
  }
);

export default api;
