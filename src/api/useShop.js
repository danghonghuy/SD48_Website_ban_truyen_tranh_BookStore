import useRequest from "./useRequest";


const useShop = () => {
    const { createPostRequest, createGetRequest, cancel } = useRequest('Product')
	const getAllProduct = async ({ pageIndex, pageSize }) => await createPostRequest({
		endpoint: '/getall',
		data: { pageIndex, pageSize }
	})
	return {
		getAllProduct,
		cancel
	}
}
export default useShop;