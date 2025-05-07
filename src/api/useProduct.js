import { data, get } from "jquery";
import useRequest from "./useRequest";
const useType = () => {
  const {
    createPostRequest,
    createPutRequest,
    createGetRequest,
    createDeleteRequest,
    cancel,
  } = useRequest("product");
  const getList = (params) =>
    createGetRequest({
      endpoint: "/get-list-product",
      params: params,
    });
  const getById = (id) =>
    createGetRequest({
      endpoint: "/detail",
      params: { id: id },
    });
  const addOrChange = (data, headers) =>
    createPostRequest({
      endpoint: "/add-or-change",
      data: data,
      headers: headers,
    });
  const changeStatus = (params, status) =>
    createGetRequest({
      endpoint: "/delete",
      params: { id: params, status: status },
    });
  const generateCode = () =>
    createGetRequest({
      endpoint: "/generate-code",
      params: null,
    });
  const uploadExcelProduct = (data) =>
    createPostRequest({
      endpoint: "/upload",
      data,
    });
  const getBestSale = (params) =>
    createGetRequest({
      endpoint: "/selling-best",
      params: params,
    });
  const getRunningOut = (params) =>
    createGetRequest({
      endpoint: "/selling-best",
      params: params,
    });
  return {
    generateCode,
    changeStatus,
    addOrChange,
    getById,
    getList,
    uploadExcelProduct,
    getBestSale,
    getRunningOut,
  };
};

export default useType;
