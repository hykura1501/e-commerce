import api from "@/config/axios";

const CATEGORY = "/categories";

export const getAllCategories = async () => {
  try {
    const res = await api.get(`${CATEGORY}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const getManufacturers = async () => { 
  try {
    const res = await api.get(`/manufacturers`);
    return res;
  } catch (error) {
    return error;
  }
}

export const createCategory = async (category) => {
  try {
    const res = await api.post(`${CATEGORY}`, category);
    return res;
  } catch (error) {
    return error;
  }
};

export const getCategory = async (id) => {
  try {
    const res = await api.get(`${CATEGORY}/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const updateCategory = async (id, category) => {
  try {
    const res = await api.put(`${CATEGORY}/${id}`, category);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteCategory = async (id) => { 
  try {
    const res = await api.delete(`${CATEGORY}/${id}`);
    return res;
  } catch (error) {
    return error;
  }
}

export const getProductsByCategory = async (id, currentPage, pageSize) => { 
  try {
    const res = await api.get(`${CATEGORY}/products/${id}?page=${currentPage}&per_page=${pageSize}`);
    return res;
  } catch (error) {
    return error;
  }
}