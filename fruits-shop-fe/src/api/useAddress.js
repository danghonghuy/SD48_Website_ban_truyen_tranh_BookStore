import useRequest from './useRequest'
const useAddress = () => {
	const {createGetRequest } = useRequest('address')
	const getProvince = (params) => createGetRequest({
		endpoint: '/get-province',
		params: params
	})
    const getDistrict = (params) => createGetRequest({
		endpoint: '/get-district',
		params: params
	})
    const getWard = (params) => createGetRequest({
		endpoint: '/get-wards',
		params: params
	})
   
	return {
		getProvince, 
        getDistrict, 
        getWard
	}
}

export default useAddress