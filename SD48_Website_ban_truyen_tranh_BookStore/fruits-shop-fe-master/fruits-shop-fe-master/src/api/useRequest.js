// src/utils/useRequest.js
import { useEffect, useState, useCallback, useMemo } from "react"; // Thêm useMemo
import useUser from "@store/useUser"; // Đổi tên import cho nhất quán
import axios from "axios";
import useHandleError from "./useHandleError";
import { isFunction } from "@utils/checkType";
import useTranslate from "@lang";
// import { message as antdMessage } from "antd"; // Không thấy dùng trực tiếp
// import { PROTOCOL, HOST, PORT } from "@configs/app.config"; // Bỏ nếu dùng env

const useRequest = (prefixPath = "") => {
  const t = useTranslate();
  const handleError = useHandleError();
  // Không cần state cho controller nếu chỉ dùng để abort
  // const [controller, setController] = useState(new AbortController());

  // Tạo axios instance một lần và ghi nhớ nó bằng useMemo
  // Token sẽ được thêm vào qua request interceptor
  const requestInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: `${process.env.REACT_APP_API_KEY}/api/${prefixPath}`,
      timeout: 8000,
      headers: {
        Accept: "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*", // CORS nên được xử lý ở BE
        "ngrok-skip-browser-warning": "true",
      },
    });

    // Request Interceptor để đính kèm token động
    instance.interceptors.request.use(
      (config) => {
        const token = useUser.getState().token; // Lấy token mới nhất từ store
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor (nếu cần, ví dụ xử lý lỗi chung, refresh token)
    instance.interceptors.response.use(
      (response) => response, // Trả về response
      (error) => {
        // Xử lý lỗi ở đây nếu muốn, ví dụ:
        // if (error.response && error.response.status === 401) {
        //   // Xử lý logout hoặc refresh token
        // }
        return Promise.reject(error); // Ném lại lỗi để nơi gọi xử lý
      }
    );
    return instance;
  }, [prefixPath]); // prefixPath thay đổi thì tạo lại instance (hiếm khi)

  const createGetRequest = useCallback(
    async ({ endpoint, params, headers, successCallback, config }) => { // Thêm async
      try {
        // Truyền AbortSignal vào config nếu cần cancel request cụ thể
        // const currentController = new AbortController();
        // const response = await requestInstance.get(endpoint, { params, headers, ...config, signal: currentController.signal });
        const response = await requestInstance.get(endpoint, { params, headers, ...config });

        if (isFunction(successCallback)) successCallback();

        if (config && config.responseType === 'blob') {
          return response; // Trả về toàn bộ response cho blob
        }
        return { success: true, data: response.data }; // Giả sử response.data là cấu trúc { success, data, message } từ BE
      } catch (err) {
        // Xử lý lỗi blob nếu có
        if (config && config.responseType === 'blob' && err.response && err.response.data instanceof Blob && err.response.data.type.includes('application/json')) {
          try {
            const text = await err.response.data.text();
            const errorJson = JSON.parse(text);
            const data = handleError({ response: { data: errorJson, status: err.response.status } });
            return { success: false, data };
          } catch (e) {
            const data = handleError(err);
            return { success: false, data };
          }
        }
        const data = handleError(err); // handleError nên trả về một object lỗi chuẩn
        return { success: false, data, message: data?.message || err.message }; // Trả về cấu trúc lỗi
      }
    },
    [requestInstance, handleError] // Phụ thuộc vào requestInstance (ổn định) và handleError
  );

  const createPostRequest = useCallback(
    async ({ endpoint, data, headers, ...props }) => { // Thêm async
      try {
        const response = await requestInstance.post(endpoint, data, { headers, ...props });
        // Giả sử response.data từ BE đã có dạng { success, data, message }
        return response.data; // Hoặc return { success: true, data: response.data } nếu BE chỉ trả về data thuần
      } catch (err) {
        const errorData = handleError(err);
        return { success: false, data: errorData, message: errorData?.message || err.message };
      }
    },
    [requestInstance, handleError] // Thêm handleError
  );

  const createPutRequest = useCallback(
    async ({ endpoint, data, params, ...props }) => { // Thêm async
      try {
        const response = await requestInstance.put(endpoint, data, { params, ...props });
        return response.data;
      } catch (err) {
        const errorData = handleError(err);
        return { success: false, data: errorData, message: errorData?.message || err.message };
      }
    },
    [requestInstance, handleError]
  );

  const createDeleteRequest = useCallback(
    async ({ endpoint, params, headers }) => { // Thêm async
      try {
        const response = await requestInstance.delete(endpoint, { params, headers });
        return response.data;
      } catch (err) {
        const errorData = handleError(err);
        return { success: false, data: errorData, message: errorData?.message || err.message };
      }
    },
    [requestInstance, handleError]
  );

  // Chức năng cancel có thể cần suy nghĩ lại cách triển khai nếu không dùng state controller
  // Hoặc mỗi request tự tạo AbortController và truyền signal
  const cancel = useCallback(() => {
    // Logic cancel phức tạp hơn nếu không dùng state controller
    // Có thể cần một cơ chế quản lý các controller cho từng request đang chạy
    console.warn("Cancel function in useRequest needs reimplementation if not using a single stateful AbortController.");
  }, []);


  return {
    // request: requestInstance, // Không cần export instance trực tiếp nếu các hàm create đã dùng nó
    createGetRequest,
    createPostRequest,
    createPutRequest,
    createDeleteRequest,
    cancel,
  };
};

export default useRequest;