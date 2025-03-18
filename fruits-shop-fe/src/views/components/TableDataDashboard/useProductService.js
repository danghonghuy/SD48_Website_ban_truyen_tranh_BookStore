import { useState } from "react";
import {
  addProductApi,
  deleteProductApi,
  getAllProductsApi,
  updateProductApi,
} from "../../../services/productApi/productServiceApi.js";

const useProductService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProductsApi();
      setLoading(false);
      setData(response.data);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const addProduct = async (newProduct) => {
    setLoading(true);
    try {
      const response = await addProductApi(newProduct);
      setLoading(false);
      setData((prevData) => [...prevData, response.data]);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const updateProduct = async (productId, updatedProduct) => {
    setLoading(true);
    try {
      await updateProductApi(productId, updatedProduct);
      setLoading(false);
      setData((prevData) => {
        const updatedData = prevData.map((product) => {
          if (product.id === productId) {
            return { ...product, ...updatedProduct };
          }
          return product;
        });
        return updatedData;
      });
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      await deleteProductApi(productId);
      setLoading(false);
      setData((prevData) =>
        prevData.filter((product) => product.id !== productId)
      );
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return {
    loading,
    error,
    data,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProductService;
