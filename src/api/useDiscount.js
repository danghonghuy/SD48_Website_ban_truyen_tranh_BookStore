import { data } from 'jquery'
import useRequest from './useRequest'
const useDiscount = () => {
	const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('discount')
	const getListDiscount = (params) => createGetRequest({
		endpoint: '/get-list-discount',
		params: params
	})
    const getById = (id) => createGetRequest({
		endpoint: '/detail',
		params: {id: id}
	})
	const addOrChange  = (data) => createPostRequest({
		endpoint: '/add-or-change',
		data: data
	})
	const changeStatus = (params, status) => createGetRequest({
		endpoint: '/delete',
		params: {id: params, status: status}
	})
	const generateCode = () => createGetRequest({
		endpoint: '/generate-code', 
		params: null
	})
	return {
		generateCode, 
		changeStatus, 
		addOrChange, 
		getById, 
		getListDiscount
	}
}

export default useDiscount