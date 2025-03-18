import axios from "axios";
import { PROTOCOL, HOST, PORT } from "@configs/app.config";

const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api/FileImage`;

// Service để lấy thông tin của một tệp hình ảnh bằng id
export const getFileImageById = async (fileImageId) => {
  try {
    const response = await axios.get(`${apiUrl}/Get-By-Id?id=${fileImageId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching file image by id:", error);
    throw error;
  }
};

// Service để xóa các tệp hình ảnh liên quan đến một sản phẩm bằng productId
export const deleteFileImagesByProductId = async (productId) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/delete-by-ProductId?productId=${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting file images by product id:", error);
    throw error;
  }
};
