import axios from "axios";
import { PROTOCOL, HOST, PORT } from "@configs/app.config";

const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api/Origin`;

// Service để tạo mới một nguồn gốc
export const createOrigin = async (newOriginData) => {
  try {
    const response = await axios.post(`${apiUrl}/create`, newOriginData);
    return response.data;
  } catch (error) {
    console.error("Error creating origin:", error);
    throw error;
  }
};

// Service để lấy tất cả nguồn gốc
export const getAllOrigins = async () => {
  try {
    const response = await axios.post(`${apiUrl}/getall`);
    return response.data;
  } catch (error) {
    console.error("Error fetching origins:", error);
    throw error;
  }
};

// Service để chỉnh sửa một nguồn gốc
export const editOrigin = async (originId, updatedOriginData) => {
  try {
    const response = await axios.put(
      `${apiUrl}/Edit/${originId}`,
      updatedOriginData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing origin:", error);
    throw error;
  }
};

// Service để xóa một nguồn gốc
export const deleteOrigin = async (originId) => {
  try {
    const response = await axios.delete(`${apiUrl}/delete/${originId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting origin:", error);
    throw error;
  }
};

// Service để xóa nhiều nguồn gốc
export const deleteMultipleOrigins = async (originIds) => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-arrange`, {
      data: { originIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting multiple origins:", error);
    throw error;
  }
};
