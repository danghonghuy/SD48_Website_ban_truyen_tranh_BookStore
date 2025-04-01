import useRequest from "./useRequest"
const useDashboard = () => {
    const {createGetRequest} = useRequest('Sastis');
    const get = async () => createGetRequest({
        endpoint: '/dashboard',
    })
  
    return {
        get
    }
}
export default useDashboard