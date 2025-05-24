import { useCallback } from 'react'; // Thêm useCallback
import useRequest from "./useRequest";

const useBranch = () => {
    const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest } = useRequest('Branch');

    const getBranch = useCallback(async (data) => createPostRequest({
        endpoint: '/getall',
        data: data
    }), [createPostRequest]);

    const getAllBranch = useCallback(async (data) => createPostRequest({
        endpoint: '/get',
        data: data
    }), [createPostRequest]);

    const getBranchById = useCallback(async (data) => createGetRequest({
        endpoint: '/detail',
        params: data
    }), [createGetRequest]);

    const createBranch = useCallback(async (data, headers) => createPostRequest({
        endpoint: '/create',
        data: data,
        headers: headers
    }), [createPostRequest]);

    const editBranch = useCallback(async (data, params) => createPutRequest({
        endpoint: '/edit',
        data: data,
        params: params
    }), [createPutRequest]);

    const changeStatus = useCallback(async (params, status) => createGetRequest({
        endpoint: '/delete',
        params: { id: params, status: status }
    }), [createGetRequest]);

    return {
        getBranch,
        getAllBranch,
        createBranch,
        editBranch,
        getBranchById,
        changeStatus
    };
};

export default useBranch;