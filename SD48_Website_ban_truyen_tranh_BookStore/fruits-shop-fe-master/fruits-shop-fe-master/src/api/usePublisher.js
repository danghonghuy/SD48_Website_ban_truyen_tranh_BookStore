// src/api/usePublisher.js
import { useCallback } from 'react'; // THÊM IMPORT NÀY
import axiosInstance from "@utils/axiosInstance";

const usePublisher = () => {
  const getListPublishers = useCallback(async (params) => {
    try {
      const response = await axiosInstance.get("/publishers", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching publishers:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi tải danh sách nhà xuất bản." };
    }
  }, []);

  const addOrChangePublisher = useCallback(async (publisherData) => {
    try {
      if (publisherData.id) {
        const response = await axiosInstance.put(`/publishers/${publisherData.id}`, publisherData);
        return response.data;
      } else {
        const response = await axiosInstance.post("/publishers", publisherData);
        return response.data;
      }
    } catch (error) {
      console.error("Error saving publisher:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi lưu nhà xuất bản." };
    }
  }, []);

  const deletePublisherById = useCallback(async (id) => {
    try {
      const response = await axiosInstance.delete(`/publishers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting publisher:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi xóa nhà xuất bản." };
    }
  }, []);

  const getPublisherById = useCallback(async (id) => {
    try {
        const response = await axiosInstance.get(`/publishers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching publisher by ID:", error.response?.data || error.message);
        throw error.response?.data || { success: false, message: "Lỗi khi lấy thông tin nhà xuất bản." };
    }
  }, []);

  return {
    getListPublishers,
    addOrChangePublisher,
    deletePublisherById,
    getPublisherById,
  };
};

export default usePublisher;