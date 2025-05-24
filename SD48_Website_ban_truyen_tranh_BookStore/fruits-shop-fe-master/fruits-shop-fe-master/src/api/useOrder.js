// Giả sử file này là: src/api/useOrder.js (hoặc đường dẫn tương tự)

import useRequest from './useRequest'; // Đường dẫn đến useRequest.js

const useOrder = () => {
	// useRequest('order') sẽ tạo ra một instance của axios với baseURL là `${process.env.REACT_APP_API_KEY}/api/order`
	const { createPostRequest, createGetRequest, createPutRequest, createDeleteRequest, cancel } = useRequest('order');

	const createOrder = (data) => {
		return createPostRequest({
			endpoint: '/create-order', // URL cuối cùng: /api/order/create-order
			data: data
		});
	};

	const getListOrder = (params) => {
		return createGetRequest({
			endpoint: '/get-list-order', // URL cuối cùng: /api/order/get-list-order
			params: params
		});
	};

	const getOrderDetail = (id) => {
		return createGetRequest({
			endpoint: '/get-by-order-id', // URL cuối cùng: /api/order/get-by-order-id
			params: { id: id }
		});
	};

	const changeStatus = (orderId, statusValue, noteValue) => {
		// API backend: PUT /api/order/{id}/change-status?status=...¬e=...
		return createPutRequest({
			endpoint: `/${orderId}/change-status`, // URL cuối cùng: /api/order/{orderId}/change-status
			data: null, // API này không yêu cầu body cho request PUT
			params: { // Các tham số này sẽ được chuyển thành query parameters
				status: statusValue,
				note: noteValue
			}
		});
	};

	const updateOrderInformation = (orderId, payload) => {
		// API backend: PUT /api/order/{id}/update-information (payload là body)
		return createPutRequest({
			endpoint: `/${orderId}/update-information`, // URL cuối cùng: /api/order/{orderId}/update-information
			data: payload // payload (thông tin cập nhật) sẽ là body của request PUT
			// API này không có query params, nên không cần thuộc tính 'params'
		});
	};

    // Nếu bạn có API để tạo mã đơn hàng (ví dụ: GET /api/order/generate-code)
    const generateOrderCode = () => {
        return createGetRequest({
            endpoint: '/generate-code' // URL cuối cùng: /api/order/generate-code
        });
    };

	// Bạn có thể thêm các hàm khác ở đây nếu cần, ví dụ:
	// const deleteOrder = (orderId) => createDeleteRequest({ endpoint: `/${orderId}` });

	return {
		createOrder,
		getListOrder,
		getOrderDetail,
		changeStatus,
		updateOrder: updateOrderInformation, // Để khớp với cách gọi apiUpdateOrder trong OrderDetail.js
        generateOrderCode, // Nếu bạn có API này
		// deleteOrder,
		cancel // Từ useRequest, nếu bạn cần dùng
	};
};

export default useOrder;