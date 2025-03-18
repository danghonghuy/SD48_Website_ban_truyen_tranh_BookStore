import useRequest from './useRequest'
const useCategory = () => {
	const { createPostRequest, createPutRequest, createGetRequest, createDeleteRequest, cancel } = useRequest('types')
	const getListType = (params) => createGetRequest({
		endpoint: '/get-list-type',
		params: params
	})
    const getItemById = (id) => createGetRequest({
		endpoint: '/detail',
		params: {id: id}
	})
    const generateCode = () => createGetRequest({
		endpoint: '/generate-code',
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
		getListType, 
        getItemById, 
        generateCode, 
        deleteItem, 
        addOrChange
	}
}

export default useCategory