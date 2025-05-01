import api from "@/config/axios";

export const getMe = async () => {
  try {
    const res = await api.get(`/users/me`);
    return res;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async ({page, per_page, search}) => { 
  try {
    const res = await api.get(`/users?page=${page}&per_page=${per_page}&search=${search}`);
    return res;
  } catch (error) {
    return error;
  }
}

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res;
  } catch (error) {
    return error;
  }
}

export const updateProfile = async (data) => { 
  try {
      const res = await api.put(`/users`, data);
      return res;
  } catch (error) {
    return error;
  }
}