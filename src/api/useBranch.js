import useRequest from "./useRequest"
const useBranch = () => {
    const {createPostRequest, createPutRequest, createGetRequest,createDeleteRequest} = useRequest('Branch');
    const getBranch = async (data) => createPostRequest({
        endpoint: '/getall',
        data: data
    })
    const getAllBranch = async (data) => createPostRequest({
        endpoint: '/get',
        data: data
    })

    const getBranchById = async (data) => createGetRequest({
        endpoint: '/detail',
        params : data
    })
    const createBranch = async (data,headers) => createPostRequest({
        endpoint: '/create',
        data: data,
        headers: headers
    })
    const editBranch = async (data,params) => createPutRequest({
        endpoint: '/edit',
        data: data,
        params: params
    })

    const changeStatus = async (params, status) =>  createGetRequest({
        endpoint: '/delete',
        params: {id: params, status: status}
    })

    return {
        getBranch,
        getAllBranch,
        createBranch,
        editBranch,
        getBranchById,
        changeStatus
    }
}
export default useBranch