// src/api/useType.js
import { useCallback } from 'react';
import useRequest from './useRequest';

const useType = () => {
  const { createGetRequest, createPostRequest } = useRequest('types'); // prefixPath là 'types'

  const getListType = useCallback((params) => createGetRequest({
    endpoint: '/get-list-type', // Sẽ thành /api/types/get-list-type
    // HOẶC nếu BE theo chuẩn RESTful:
    // endpoint: '/', // Sẽ thành /api/types
    params: params
  }), [createGetRequest]);

  const getItemById = useCallback((id) => createGetRequest({
    endpoint: `/detail`, // Sẽ thành /api/types/detail
    // HOẶC nếu theo RESTful: endpoint: `/${id}`
    params: { id: id }
  }), [createGetRequest]);

  const generateCode = useCallback(() => createGetRequest({
    endpoint: '/generate-code', // Sẽ thành /api/types/generate-code
  }), [createGetRequest]);

  const changeStatus = useCallback((id, status) => createGetRequest({
    endpoint: '/delete', // Sẽ thành /api/types/delete
    params: { id: id, status: status }
  }), [createGetRequest]);

  const addOrChange = useCallback((params) => createPostRequest({
    endpoint: '/add-or-change', // Sẽ thành /api/types/add-or-change
    data: params
  }), [createPostRequest]);

  return {
    getListType,
    getItemById,
    generateCode,
    changeStatus,
    addOrChange
  };
};

export default useType;