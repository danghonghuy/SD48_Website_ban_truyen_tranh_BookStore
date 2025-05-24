// import { data, get } from "jquery"; // Không sử dụng, có thể xóa
import useRequest from "./useRequest"; // Đảm bảo đường dẫn này đúng

// Đổi tên hook từ useType thành useProduct
const useProduct = () => {
  const {
    createPostRequest,
    createPutRequest,
    createGetRequest,
    createDeleteRequest,
    // cancel, // Nếu không sử dụng, có thể xóa
  } = useRequest("product"); // Giả định "product" là base path cho các API liên quan đến sản phẩm

  const getList = (params) =>
    createGetRequest({
      endpoint: "/get-list-product", // Ví dụ: /product/get-list-product
      params: params,
    });

  const getById = (id) =>
    createGetRequest({
      endpoint: "/detail", // Ví dụ: /product/detail
      params: { id: id },
    });

  const addOrChange = (data, headers) =>
    createPostRequest({
      endpoint: "/add-or-change", // Ví dụ: /product/add-or-change
      data: data,
      headers: headers,
    });

  const changeStatus = (id, status) => // Đổi tên params thành id cho rõ ràng
    createGetRequest({ // Lưu ý: Thay đổi trạng thái thường dùng PUT, nhưng nếu API của bạn dùng GET và /delete thì vẫn giữ nguyên
      endpoint: "/delete", // Endpoint này có vẻ không phù hợp với "changeStatus", thường là /status hoặc /toggle-active
      params: { id: id, status: status },
    });

  const generateCode = () =>
    createGetRequest({
      endpoint: "/generate-code", // Ví dụ: /product/generate-code
      params: null, // Có thể bỏ qua nếu không có params
    });

  const uploadExcelProduct = (data) =>
    createPostRequest({
      endpoint: "/upload", // Ví dụ: /product/upload
      data,
    });

  // --- THÊM HÀM XUẤT EXCEL VÀO ĐÂY ---
  const exportExcelProduct = (params) =>
    createGetRequest({
      endpoint: "/export-excel", // Endpoint API để xuất Excel (ví dụ: /product/export-excel)
      params: params, // Truyền các tham số lọc để xuất dữ liệu theo điều kiện
      config: { responseType: "blob" }, // RẤT QUAN TRỌNG: Để nhận dữ liệu file nhị phân
    });
  // ------------------------------------

  const getBestSale = (params) =>
    createGetRequest({
      endpoint: "/selling-best", // Ví dụ: /product/selling-best
      params: params,
    });

  const getRunningOut = (params) =>
    createGetRequest({
      endpoint: "/running-out", // Ví dụ: /product/running-out
      params: params,
    });

  return {
    generateCode,
    changeStatus,
    addOrChange,
    getById,
    getList,
    uploadExcelProduct,
    exportExcelProduct, // Đảm bảo export hàm mới này
    getBestSale,
    getRunningOut,
  };
};

// Đổi tên export từ useType thành useProduct
export default useProduct;