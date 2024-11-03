import axios from 'axios';
import { Product, ProductFormData } from '../types/product';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {
  async getProducts() {
    const response = await axios.get<Product[]>(`${API_BASE_URL}/producto`);
    return response.data;
  },

  async getCategories() {
    const response = await axios.get(`${API_BASE_URL}/categoria`);
    return response.data;
  },

  async createProduct(data: ProductFormData) {
    const response = await axios.post(`${API_BASE_URL}/producto`, data);
    return response.data;
  },

  async updateProduct(id: number, data: ProductFormData) {
    const response = await axios.put(`${API_BASE_URL}/producto/actualizar/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await axios.delete(`${API_BASE_URL}/producto/eliminar/${id}`);
    return response.data;
  },
};