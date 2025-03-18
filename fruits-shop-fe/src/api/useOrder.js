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
	return {
		createOrder,
		getListOrder
	}
} 
export default useOrder