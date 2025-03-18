import useRequest from './useRequest'
const useRole = () => {
    
	const { createPostRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('role')
	const getListRole = (params) => createGetRequest({
		endpoint: '/get-list-role',
		params: params
	})
    const getItemById = (id) => createGetRequest({
		endpoint: '/detail',
		params: {id: id}
	})
    const generateCode = () => createGetRequest({
		endpoint: '/generate-code',
		params: null
	})
	
	const deleteItem = (id) => createDeleteRequest({
		endpoint: '/delete',
		params: {id: id}
	})

	const addOrChange = (params) => createPostRequest({
		endpoint: '/add-or-change',
		data: params
	})
	
	return {
		getListRole, 
        getItemById, 
        generateCode, 
        deleteItem, 
        addOrChange
	}
}

export default useRole