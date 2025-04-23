import useRequest from "./useRequest"
const useDashboard = () => {
    const { createGetRequest } = useRequest('home');
    const getStatistical = async (code) => createGetRequest({
        endpoint: `${code}/statistical`,
    })

    return {
        getStatistical
    }
}
export default useDashboard