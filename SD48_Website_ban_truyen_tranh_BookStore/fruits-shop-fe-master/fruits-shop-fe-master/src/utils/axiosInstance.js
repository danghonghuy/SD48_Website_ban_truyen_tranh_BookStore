// src/utils/axiosInstance.js
import axios from 'axios';
import useUser from '@store/useUser'; // Giả sử bạn dùng Zustand store này để lấy token

const API_BASE_URL = 'http://localhost:8080/api';  // Nếu API có tiền tố /api, thì nên là 'http://localhost:8080/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useUser.getState().token; // Lấy token từ Zustand store
    // Hoặc nếu bạn lưu token trong localStorage:
    // const token = localStorage.getItem('authToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Trả về toàn bộ object response để nơi gọi có thể lấy data, status, headers
    // Hoặc: return response.data; // Nếu bạn chỉ muốn trả về phần data
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response Data:', error.response.data);
      console.error('API Error Status:', error.response.status);
      // console.error('API Error Headers:', error.response.headers); // Có thể bỏ log này nếu không cần thiết

      if (error.response.status === 401) {
        // Xử lý lỗi Unauthorized
        // Ví dụ: Xóa token và chuyển hướng
        // useUser.getState().resetData(); // Nếu có hàm reset trong store
        // localStorage.removeItem('authToken');
        // if (window.location.pathname !== '/login') { // Tránh vòng lặp redirect
        //    window.location.href = '/login';
        // }
        // Hoặc hiển thị thông báo lỗi cho người dùng
        // Hoặc gọi API refresh token
      } else if (error.response.status === 403) {
        // Xử lý lỗi Forbidden
        // Có thể hiển thị thông báo "Bạn không có quyền thực hiện hành động này."
      }
      // ... các xử lý lỗi khác
    } else if (error.request) {
      console.error('API No Response (Network Error or Server Down):', error.request);
    } else {
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error); // Quan trọng: Ném lại lỗi
  }
);

export default axiosInstance;