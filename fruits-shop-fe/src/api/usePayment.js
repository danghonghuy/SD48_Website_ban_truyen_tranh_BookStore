import { data } from 'jquery'
import useRequest from './useRequest'
const usePayment = () => {
	const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('payment')
	const getListPayment = (params) => createGetRequest({
		endpoint: '/get-list-payment',
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
		getListPayment
	}
}

export default usePayment