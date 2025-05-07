import useRequest from './useRequest'
const useCategory = () => {
    
	const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('category')
	const getListCategory = (params) => createGetRequest({
		endpoint: '/get-category-list',
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
	
	const changeStatus = (id, status) => createGetRequest({
		endpoint: '/delete',
		params: {id: id, status: status}
	})

	const addOrChange = (params) => createPostRequest({
		endpoint: '/add-or-change',
		data: params
	})
	
	return {
		getListCategory, 
        getItemById, 
        generateCode, 
        changeStatus, 
        addOrChange
	}
}

export default useCategory