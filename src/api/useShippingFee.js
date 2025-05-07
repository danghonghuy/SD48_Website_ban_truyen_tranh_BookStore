import useRequest from "./useRequest";
const useShippingFee = () => {
  const { createGetRequest } = useRequest("shipping-fee");
  const getFee = (params) =>
    createGetRequest({
      endpoint: "/getFee",
      params: params,
    });

  return {
    getFee,
  };
};

export default useShippingFee;
