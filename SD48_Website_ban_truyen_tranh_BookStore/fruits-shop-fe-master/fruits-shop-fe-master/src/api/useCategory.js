// src/api/useCategory.js
import { useCallback } from 'react';
import useRequest from './useRequest';

const useCategory = () => {
  const { createGetRequest, createPostRequest } = useRequest('category'); // prefixPath là 'category'

  const getListCategory = useCallback((params) => createGetRequest({
    endpoint: '/get-category-list', // Sẽ thành /api/category/get-category-list
    // HOẶC nếu BE theo chuẩn RESTful và useRequest không tự thêm 'category':
    // endpoint: '/', // Sẽ thành /api/category (nếu prefixPath là 'category')
    // HOẶC nếu BE là /api/categories và useRequest không thêm prefix:
    // endpoint: '/categories', // (Lúc này useRequest('') hoặc bỏ prefixPath)
    params: params
  }), [createGetRequest]);

  const getItemById = useCallback((id) => createGetRequest({
    endpoint: `/detail`, // Sẽ thành /api/category/detail (cần xem BE có endpoint này không)
    // HOẶC nếu theo RESTful: endpoint: `/${id}`
    params: { id: id } // Thường thì ID sẽ nằm trong path, không phải params cho GET by ID
  }), [createGetRequest]);

  const generateCode = useCallback(() => createGetRequest({
    endpoint: '/generate-code', // Sẽ thành /api/category/generate-code
  }), [createGetRequest]);

  const changeStatus = useCallback((id, status) => createGetRequest({
    // Endpoint này có vẻ giống delete hoặc update, cần xem xét lại method
    // Nếu là update status, có thể là PUT hoặc PATCH
    endpoint: '/delete', // Sẽ thành /api/category/delete
    params: { id: id, status: status }
  }), [createGetRequest]);

  const addOrChange = useCallback((params) => createPostRequest({
    // Endpoint này có thể cần phân biệt POST (add) và PUT (change)
    endpoint: '/add-or-change', // Sẽ thành /api/category/add-or-change
    data: params
  }), [createPostRequest]);
  
  return {
    getListCategory,
    getItemById,
    generateCode,
    changeStatus,
    addOrChange
  };
};

export default useCategory;