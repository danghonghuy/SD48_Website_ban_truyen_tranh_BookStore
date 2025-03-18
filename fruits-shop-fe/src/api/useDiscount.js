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
	const deleteProduct = (params) => createDeleteRequest({
		endpoint: '/delete',
		params: params
	})
	const generateCode = () => createGetRequest({
		endpoint: '/generate-code', 
		params: null
	})
	return {
		generateCode, 
		deleteProduct, 
		addOrChange, 
		getById, 
		getListDiscount
	}
}

export default useDiscount