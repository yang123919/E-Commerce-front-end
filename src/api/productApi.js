import axios from "axios";

const API_URL = "http://localhost:2000/products";

// GET all products
export const getProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// POST new product
export const createProduct = async (product) => {
    const response = await axios.post(API_URL, product);
    return response.data;
};

// UPDATE product
export const updateProduct = async (id, product) => {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data;
};

// DELETE product
export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
    