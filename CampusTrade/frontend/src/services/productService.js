import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`;

const productService = {
  getAllProducts: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/products`, { params });
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  createProductWithImages: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  updateProduct: async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {

      throw error;
    }
  }
};

export default productService;
