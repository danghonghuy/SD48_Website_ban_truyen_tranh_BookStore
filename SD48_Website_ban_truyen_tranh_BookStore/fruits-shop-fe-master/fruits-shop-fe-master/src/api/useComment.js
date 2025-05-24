import useRequest from './useRequest'
const useComment = () => {
    const { createPostRequest,createGetRequest,cancel} = useRequest('Comments')
    const addComment = (data) => createPostRequest({
        endpoint: '/create',
        data: data
    })
    const getCommentByProduct = (data) => createGetRequest({
        endpoint: '/find-by-product',
        params: data,
    })
    return  {
        addComment,
        getCommentByProduct
    }
}
export default useComment