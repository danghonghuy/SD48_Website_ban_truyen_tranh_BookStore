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

    const deleteBranch = async (params) =>  createDeleteRequest({
        endpoint: '/delete',
        params: params
    })

    return {
        getBranch,
        getAllBranch,
        createBranch,
        editBranch,
        getBranchById,
        deleteBranch
    }
}
export default useBranch