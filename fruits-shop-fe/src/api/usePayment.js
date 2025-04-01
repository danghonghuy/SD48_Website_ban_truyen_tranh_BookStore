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
	const changeStatus = (id, status) => createGetRequest({
		endpoint: '/delete',
		params: {id: id, status: status}
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
		getListPayment
	}
}

export default usePayment