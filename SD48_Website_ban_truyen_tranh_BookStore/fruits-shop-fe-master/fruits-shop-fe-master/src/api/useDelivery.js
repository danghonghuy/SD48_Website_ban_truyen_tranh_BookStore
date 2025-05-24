import { data } from 'jquery'
import useRequest from './useRequest'
const useDelivery = () => {
    const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('delivery')
    const getListDelivery = (params) => createGetRequest({
        endpoint: '/get-list',
        params: params
    })
    const getById = (id) => createGetRequest({
        endpoint: '/detail',
        params: {id: id}
    })
    const addOrChange  = (data, headers) => createPostRequest({
        endpoint: '/add-or-change',
        data: data,
        headers: headers
    })
    const changeStatusDelivery = (params, status) => createGetRequest({
        endpoint: '/delete',
        params: {id : params, status: status}
    })
    const generateCode = () => createGetRequest({
        endpoint: '/generate-code', 
        params: null
    })
    return {
        generateCode, 
        changeStatusDelivery, 
        addOrChange, 
        getById, 
        getListDelivery
    }
}

export default useDelivery