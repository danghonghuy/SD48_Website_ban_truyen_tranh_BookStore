import useRequest from "./useRequest";


const useVnPay = () => {
    const { createPostRequest, createGetRequest, cancel } = useRequest('VnPay')
	const createPaymentUrl = async ({ orderType, amount, orderDescription, name }) => await createPostRequest({
		endpoint: '/createPaymentUrl',
		data: { orderType, amount, orderDescription, name }
	})
	return {
		createPaymentUrl,
		cancel
	}
}
export default useVnPay;