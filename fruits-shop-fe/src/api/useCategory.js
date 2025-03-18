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
	
	const deleteItem = (id) => createDeleteRequest({
		endpoint: '/delete',
		params: {id: id}
	})

	const addOrChange = (params) => createPostRequest({
		endpoint: '/add-or-change',
		data: params
	})
	
	return {
		getListCategory, 
        getItemById, 
        generateCode, 
        deleteItem, 
        addOrChange
	}
}

export default useCategory