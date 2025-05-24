import { useCallback } from 'react'; // THÊM DÒNG NÀY
import useRequest from './useRequest';

const useCatalog = () => {
    const { createPostRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('catalog');

    const getList = useCallback((params) => createGetRequest({
        endpoint: '/get-list',
        params: params
    }), [createGetRequest]); // THÊM DEPENDENCY

    const getItemById = useCallback((id) => createGetRequest({
        endpoint: '/detail',
        params: { id: id }
    }), [createGetRequest]); // THÊM DEPENDENCY

    const generateCode = useCallback(() => createGetRequest({
        endpoint: '/generate-code',
        params: null // Hoặc không cần params nếu API không yêu cầu
    }), [createGetRequest]); // THÊM DEPENDENCY

    const changeStatus = useCallback((id, status) => createGetRequest({
        endpoint: '/delete',
        params: { id: id, status: status }
    }), [createGetRequest]); // THÊM DEPENDENCY

    const addOrChange = useCallback((params) => createPostRequest({
        endpoint: '/add-or-change',
        data: params
    }), [createPostRequest]); // THÊM DEPENDENCY

    return {
        getList,
        getItemById,
        generateCode,
        changeStatus,
        addOrChange
        // cancel không được trả về, nếu cần thì thêm và bọc useCallback
    };
};

export default useCatalog;