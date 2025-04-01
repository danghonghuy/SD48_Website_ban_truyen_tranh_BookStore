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
	const changeStatus = (id, status) => createGetRequest({
		endpoint: '/delete',
		params: {id: id, status: status}
	})
	const addOrChange = (params) => createPostRequest({
		endpoint: '/add-or-change',
		data: params
	})
	return {
		getListType, 
        getItemById, 
        generateCode, 
        changeStatus, 
        addOrChange
	}
}

export default useCategory