import useRequest from './useRequest'

const useAuth = () => {
	const { createPostRequest,createPutRequest,createGetRequest, cancel } = useRequest('user')
	const login = ({ userName, password }) => createPostRequest({
		endpoint: '/login',
		data: {userName,password }
	})
	const register = (data) => createPostRequest({
		endpoint: '/register',
		data: data
	})
	const changpassWord = (data) => createPutRequest({
		endpoint: '/changePass',
		data: data
	})


	const getUser = (data) => createPostRequest({
		endpoint: '/getUser',
		data: data
	})

	const getUserById = (data) => createGetRequest({
		endpoint: '/getbyId',
		params: data
	})

	const getUserDetail = (data) => createGetRequest({
		endpoint: '/getUserDetail',
		params: data
	})
	
	return {
		login,
		register,
		cancel,
		changpassWord,
		getUser,
		getUserDetail,
		getUserById
	}
}

export default useAuth