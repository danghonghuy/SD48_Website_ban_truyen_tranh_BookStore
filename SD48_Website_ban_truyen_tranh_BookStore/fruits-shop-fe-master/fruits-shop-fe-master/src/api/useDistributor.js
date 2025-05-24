// src/api/useDistributor.js
import { useCallback } from 'react'; // THÊM IMPORT NÀY
import axiosInstance from "@utils/axiosInstance";

const useDistributor = () => {
  const getListDistributors = useCallback(async (params) => {
    try {
      const response = await axiosInstance.get("/distributors", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching distributors:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi tải danh sách nhà phát hành." };
    }
  }, []);

  const addOrChangeDistributor = useCallback(async (distributorData) => {
    try {
      if (distributorData.id) {
        const response = await axiosInstance.put(`/distributors/${distributorData.id}`, distributorData);
        return response.data;
      } else {
        const response = await axiosInstance.post("/distributors", distributorData);
        return response.data;
      }
    } catch (error) {
      console.error("Error saving distributor:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi lưu nhà phát hành." };
    }
  }, []);

  const deleteDistributorById = useCallback(async (id) => {
    try {
      const response = await axiosInstance.delete(`/distributors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting distributor:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi xóa nhà phát hành." };
    }
  }, []);

  const getDistributorById = useCallback(async (id) => {
    try {
        const response = await axiosInstance.get(`/distributors/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching distributor by ID:", error.response?.data || error.message);
        throw error.response?.data || { success: false, message: "Lỗi khi lấy thông tin nhà phát hành." };
    }
  }, []);

  return {
    getListDistributors,
    addOrChangeDistributor,
    deleteDistributorById,
    getDistributorById,
  };
};

export default useDistributor;