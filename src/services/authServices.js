import api from "@/config/axios";

const AUTH = "/auth";

export const login = async (body) => {
  try {
    const res = await api.post(`${AUTH}/login/local`, body);
    return res;
  } catch (error) {
    return error;
  }
};

export const loginFacebook = async (body) => {
  try {
    const res = await api.get(`${AUTH}/login/facebook`, body);
    return res;
  } catch (error) {
    return error;
  }
};

export const loginGoogle = async (body) => {
  try {
    const res = await api.get(`${AUTH}/login/google`, body);
    return res;
  } catch (error) {
    return error;
  }
};

export const register = async (body) => {
  try {
    const res = await api.post(`${AUTH}/register`, body);
    return res;
  } catch (error) {
    return error;
  }
};

export const logout = async () => {
  try {
    const res = await api.get(`${AUTH}/logout`);
    return res;
  } catch (error) {
    return error;
  }
};