import { data } from 'jquery'
import useRequest from './useRequest'
const useCoupon = () => {
	const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('coupon')
	const getListCoupon = (params) => createGetRequest({
		endpoint: '/get-list-coupon',
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
	const updateStatus = (params,status) => createGetRequest({
		endpoint: '/delete',
		params: {id: params, status: status}
	})
	const generateCode = () => createGetRequest({
		endpoint: '/generate-code', 
		params: null
	})
	const getCouponCode = (params) => createGetRequest({
		endpoint: '/get-coupon-code', 
		params: params
	})
	return {
		generateCode, 
		updateStatus, 
		addOrChange, 
		getById, 
		getListCoupon,
		getCouponCode
	}
}

export default useCoupon