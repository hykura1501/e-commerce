import api from "@/config/axios";

const PRODUCTS = "/products";

export const getProducts = async ({
  current_page,
  page_size,
  search = "",
  tag = "",
  category_id = "",
  price_min = "",
  price_max = "",
  order = "",
}) => {
  try {
    const res = await api.get(
      `${PRODUCTS}?current_page=${current_page}&page_size=${page_size}&search=${search}&tag=${tag}&category_id=${category_id}&price_min=${price_min}&price_max=${price_max}&order=${order}`
    );
    return res;
  } catch (error) {
    return error;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await api.get(`${PRODUCTS}/detail/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const createProduct = async (product) => {
  try {
    const res = await api.post(`${PRODUCTS}/create`, product);
    return res;
  } catch (error) {
    return error;
  }
};

export const updateProduct = async (product, id) => {
  try {
    const res = await api.put(`${PRODUCTS}/${id}`, product);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`${PRODUCTS}/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const getHomeProducts = async (size) => {
  try {
    const res = await api.get(`${PRODUCTS}/special-products?size=${size}`);
    return res;
  } catch (error) {
    return error;
  }
};
