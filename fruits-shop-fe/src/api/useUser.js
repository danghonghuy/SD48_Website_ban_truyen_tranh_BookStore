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
	const changeStatus = (id, status) => createGetRequest({
		endpoint: '/delete',
		params: {id: id, status: status}
	})
	const addOrChange = (params, header) => createPostRequest({
		endpoint: '/register',
		data: params, 
		headers: header
	})
	const createShortUser = (params) => createPostRequest({
		endpoint: '/create-short-user',
		data: params
	})
	return {
		getListUser, 
        getUserById, 
        generateCode, 
        changeStatus, 
        addOrChange,
		createShortUser
	}
}

export default useUser