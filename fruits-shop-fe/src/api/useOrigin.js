import useRequest from "./useRequest";

const useOrigin = () => {
  const { createPostRequest, createGetRequest } = useRequest("Origin");
  const getOrigin = async (data) =>
    createPostRequest({
      endpoint: "/getall",
      data: data,
    });

    const getAllOrigin = async (data) =>
    createPostRequest({
      endpoint: "/get",
      data: data,
    });

  return {
    getOrigin,
    getAllOrigin
  };
};
export default useOrigin;
