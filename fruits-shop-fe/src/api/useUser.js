import useRequest from './useRequest'
const useUser = () => {
	const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('user')
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
	const deleteItem = (id) => createDeleteRequest({
		endpoint: '/delete',
		params: {id: id}
	})
	const addOrChange = (params, header) => createPostRequest({
		endpoint: '/register',
		data: params, 
		headers: header
	})
	return {
		getListUser, 
        getUserById, 
        generateCode, 
        deleteItem, 
        addOrChange
	}
}

export default useUser