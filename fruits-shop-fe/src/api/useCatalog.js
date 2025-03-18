import useRequest from './useRequest'
const useCatalog = () => {
    
	const { createPostRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('catalog')
	const getList = (params) => createGetRequest({
		endpoint: '/get-list',
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
		getList, 
        getItemById, 
        generateCode, 
        deleteItem, 
        addOrChange
	}
}

export default useCatalog