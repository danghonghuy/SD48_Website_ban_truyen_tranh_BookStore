import useRequest from './useRequest'

const useOrder = () => {
	const { createPostRequest, createGetRequest, createPutRequest, cancel } = useRequest('order')

	const createOrder = (data) => createPostRequest({
		endpoint: '/create-order',
		data: data
	})
	const getListOrder = (params) => createGetRequest({
		endpoint: '/get-list-order',
		params: params
	})
	const getOrderDetail = (id) => createGetRequest({
		endpoint: '/get-by-order-id',
		params: { id: id }
	})
	const changeStatus = (id, status, note) => createGetRequest({
		endpoint: '/change-status',
		params: { id: id, status: status, note }
	})
	return {
		createOrder,
		getListOrder,
		getOrderDetail,
		changeStatus
	}
}
export default useOrder