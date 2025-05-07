import useRequest from "./useRequest";
const useDashboard = () => {
  const { createGetRequest } = useRequest("home");
  const getStatistical = async (code, params) =>
    createGetRequest({
      endpoint: `${code}/statistical`,
      params: params,
    });

  return {
    getStatistical,
  };
};
export default useDashboard;
