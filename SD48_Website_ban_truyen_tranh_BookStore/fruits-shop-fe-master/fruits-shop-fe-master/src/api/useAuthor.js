// src/api/useAuthor.js
import { useCallback } from 'react'; // THÊM IMPORT NÀY
import axiosInstance from "@utils/axiosInstance";

const useAuthor = () => {
  // Giả sử axiosInstance là một đối tượng ổn định (không thay đổi tham chiếu giữa các lần render)
  // Nếu axiosInstance cũng được tạo động, bạn cần đảm bảo nó ổn định hoặc đưa nó vào dependency array.
  // Tuy nhiên, thường thì instance của axios được tạo một lần và export ra.

  const getListAuthors = useCallback(async (params) => {
    try {
      const response = await axiosInstance.get("/authors", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching authors:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi tải danh sách tác giả." };
    }
  }, []); // Dependency array rỗng vì hàm này không phụ thuộc vào state/props nào bên trong useAuthor

  const addOrChangeAuthor = useCallback(async (authorData) => {
    try {
      if (authorData.id) {
        const response = await axiosInstance.put(`/authors/${authorData.id}`, authorData);
        return response.data;
      } else {
        const response = await axiosInstance.post("/authors", authorData);
        return response.data;
      }
    } catch (error) {
      console.error("Error saving author:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi lưu tác giả." };
    }
  }, []);

  const deleteAuthorById = useCallback(async (id) => {
    try {
      const response = await axiosInstance.delete(`/authors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting author:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Lỗi khi xóa tác giả." };
    }
  }, []);

  const getAuthorById = useCallback(async (id) => {
    try {
        const response = await axiosInstance.get(`/authors/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching author by ID:", error.response?.data || error.message);
        throw error.response?.data || { success: false, message: "Lỗi khi lấy thông tin tác giả." };
    }
  }, []);

  return {
    getListAuthors,
    addOrChangeAuthor,
    deleteAuthorById,
    getAuthorById,
  };
};

export default useAuthor;