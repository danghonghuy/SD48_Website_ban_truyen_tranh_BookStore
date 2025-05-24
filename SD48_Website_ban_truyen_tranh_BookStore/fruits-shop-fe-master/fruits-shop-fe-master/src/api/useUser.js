import useRequest from './useRequest'

const useUser = () => {
    const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('user')

    // ... các hàm khác giữ nguyên ...
    const getListUser = (params) => createGetRequest({
		endpoint: '/get-list-user',
		params: params
	})
    const getUserById = (id) => createGetRequest({
		endpoint: '/detail',
		params: {id: id}
	})
    const generateCode = (params) => createGetRequest({
		endpoint: '/generate-code',
        params: params
	})
	const changeStatus = (id, status) => createGetRequest({
		endpoint: '/delete',
		params: {id: id, status: status}
	})

    // SỬA HÀM NÀY
    const addOrChange = (data, headers, userId) => { // Thêm userId vào tham số
        if (userId) {
            // Nếu có userId, đây là trường hợp CẬP NHẬT
            // Backend endpoint là PUT /api/user/profile/update
            // Dữ liệu gửi đi (data) vẫn là FormData
            return createPutRequest({ // Sử dụng createPutRequest
                endpoint: '/profile/update', // Endpoint cho cập nhật
                data: data,
                headers: headers
            });
        } else {
            // Nếu không có userId, đây là trường hợp THÊM MỚI
            // Backend endpoint là POST /api/user/register
            return createPostRequest({
                endpoint: '/register', // Endpoint cho thêm mới
                data: data,
                headers: headers
            });
        }
    }

	const createShortUser = (params) => createPostRequest({
		endpoint: '/create-short-user',
		data: params
	})

    return {
        getListUser,
        getUserById,
        generateCode,
        changeStatus,
        addOrChange, // Hàm đã được sửa
        createShortUser
    }
}

export default useUser