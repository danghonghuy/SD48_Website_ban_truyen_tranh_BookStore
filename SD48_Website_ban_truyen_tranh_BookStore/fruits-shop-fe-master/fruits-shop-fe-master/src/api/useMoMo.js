import useRequest from "./useRequest";

const useMoMo = () => {
  const { createGetRequest, cancel } = useRequest("payment");

  const getUrlPayment = async (data) =>
    await createGetRequest({
      endpoint: "/get-url-payment",
      params: {
        orderId: data.orderId,
        amount: data.amount,
      },
    });

  return {
    getUrlPayment,
    cancel,
  };
};

export default useMoMo;
