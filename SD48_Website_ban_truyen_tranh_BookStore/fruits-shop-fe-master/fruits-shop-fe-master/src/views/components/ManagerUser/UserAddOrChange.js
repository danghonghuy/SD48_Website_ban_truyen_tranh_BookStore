import { PlusSquareOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Image,
  Upload,
  DatePicker,
  Card,
} from "antd";
import React, { useEffect, useState } from "react";
import useUser from "@api/useUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAddress from "@api/useAddress";
import { EyeClosed, Trash2, Star, Eye } from "lucide-react";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UserAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { addOrChange, generateCode, getUserById } = useUser();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [provinces, setProvinces] = useState([]); // Đổi tên từ province để rõ ràng là mảng
  const { getProvince, getDistrict, getWard } = useAddress();
  const [fileList, setFileList] = useState([]);
  // const [gender, setGender] = useState(""); // Không thấy dùng trực tiếp, form xử lý

  const initialAddressEntry = () => ({
    id: null,
    provinceId: null,
    districtId: null,
    wardId: null,
    addressDetail: "",
    provinceName: null,
    districtName: null,
    wardName: null,
    stage: 1,
    isDefault: 0,
    districts: [],
    wards: [],
    visiable: true,
  });
  const [addressList, setAddressList] = useState([initialAddressEntry()]); // Đổi tên từ address

  useEffect(() => {
    // Set isDefault cho địa chỉ đầu tiên nếu chưa có
    if (addressList.length === 1 && addressList[0].isDefault !== 1) {
      setAddressList((prev) => [{ ...prev[0], isDefault: 1 }]);
    }
  }, [addressList]);

  const handleRemoveFile = () => setFileList([]);
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </button>
  );

  const addAddressModel = () => {
    const hasDefault = addressList.some(
      (addr) => addr.isDefault === 1 && addr.stage === 1
    );
    const newAddress = {
      ...initialAddressEntry(),
      isDefault: hasDefault ? 0 : 1,
    };
    setAddressList((prev) => [...prev, newAddress]);
    // Antd form sẽ tự động thêm field khi Form.List được render với item mới
  };

  const handleSelectedChange = async (value, addressIndex, fieldName) => {
    console.log(
      `[UserForm ADDR_CHANGE] Index: ${addressIndex}, Field: ${fieldName}, Value: ${value}`
    );
    let updatedAddressList = JSON.parse(JSON.stringify(addressList));
    let currentAddressItem = updatedAddressList[addressIndex];
    const formAddressPath = `address[${addressIndex}]`;

    if (fieldName === "provinceId") {
      currentAddressItem.provinceId = value;
      const selectedProv = provinces.find((p) => p.value === value); // Giả sử provinces là [{value, label}]
      currentAddressItem.provinceName = selectedProv
        ? selectedProv.label
        : null;
      currentAddressItem.districtId = null;
      currentAddressItem.districtName = null;
      currentAddressItem.districts = [];
      currentAddressItem.wardId = null;
      currentAddressItem.wardName = null;
      currentAddressItem.wards = [];
      form.setFieldsValue({
        [`${formAddressPath}.districtId`]: null,
        [`${formAddressPath}.wardId`]: null,
      });

      if (value) {
        try {
          console.log(
            `[UserForm ADDR_CHANGE] Fetching districts for province: ${value}`
          );
          const districtResponse = await getDistrict({
            code: value,
            name: null,
          }); // Gửi 'code' cho provinceId
          console.log(
            `[UserForm ADDR_CHANGE] RAW API Resp for getDistrict (province ${value}):`,
            JSON.stringify(districtResponse, null, 2)
          );
          let districtArray = null;
          if (
            districtResponse &&
            districtResponse.success &&
            districtResponse.data
          ) {
            if (Array.isArray(districtResponse.data))
              districtArray = districtResponse.data; // Trường hợp 1
            else if (
              districtResponse.data.data &&
              Array.isArray(districtResponse.data.data)
            )
              districtArray = districtResponse.data.data; // Trường hợp 2
          }
          if (districtArray) {
            currentAddressItem.districts = districtArray.map((d) => ({
              code: d.code,
              name: d.name,
            })); // Chỉ lưu code và name
            console.log(
              `[UserForm ADDR_CHANGE] Districts for province ${value}:`,
              currentAddressItem.districts
            );
          } else {
            toast.error(
              districtResponse?.data?.message ||
                districtResponse?.message ||
                "Lỗi tải quận/huyện."
            );
          }
        } catch (err) {
          console.error(err);
          toast.error("Lỗi mạng khi tải quận/huyện.");
        }
      }
    } else if (fieldName === "districtId") {
      currentAddressItem.districtId = value;
      const selectedDist = currentAddressItem.districts.find(
        (d) => d.code === value
      );
      currentAddressItem.districtName = selectedDist ? selectedDist.name : null;
      currentAddressItem.wardId = null;
      currentAddressItem.wardName = null;
      currentAddressItem.wards = [];
      form.setFieldsValue({ [`${formAddressPath}.wardId`]: null });

      if (value) {
        try {
          console.log(
            `[UserForm ADDR_CHANGE] Fetching wards for district: ${value}`
          );
          const wardResponse = await getWard({
            districtCode: value,
            name: null,
          }); // Gửi 'districtCode'
          console.log(
            `[UserForm ADDR_CHANGE] RAW API Resp for getWard (district ${value}):`,
            JSON.stringify(wardResponse, null, 2)
          );
          let wardArray = null;
          if (wardResponse && wardResponse.success && wardResponse.data) {
            if (Array.isArray(wardResponse.data)) wardArray = wardResponse.data;
            else if (
              wardResponse.data.data &&
              Array.isArray(wardResponse.data.data)
            )
              wardArray = wardResponse.data.data;
          }
          if (wardArray) {
            currentAddressItem.wards = wardArray.map((w) => ({
              code: w.code,
              name: w.name,
            }));
            console.log(
              `[UserForm ADDR_CHANGE] Wards for district ${value}:`,
              currentAddressItem.wards
            );
          } else {
            toast.error(
              wardResponse?.data?.message ||
                wardResponse?.message ||
                "Lỗi tải phường/xã."
            );
          }
        } catch (err) {
          console.error(err);
          toast.error("Lỗi mạng khi tải phường/xã.");
        }
      }
    } else if (fieldName === "wardId") {
      currentAddressItem.wardId = value;
      const selectedWard = currentAddressItem.wards.find(
        (w) => w.code === value
      );
      currentAddressItem.wardName = selectedWard ? selectedWard.name : null;
    }
    setAddressList(updatedAddressList);
  };

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode({ prefix: "CUS" });
    if (!success || data?.status === "Error")
      toast.error(data?.message || "Lỗi tạo mã");
    else form.setFieldsValue({ code: data.data });
  };

  const fetchUserById = async () => {
    if (!modelItem?.id) return;
    const { success, data: userDataResponse } = await getUserById(modelItem.id);
    if (
      !success ||
      !userDataResponse ||
      userDataResponse.status === "Error" ||
      !userDataResponse.data
    ) {
      toast.error(userDataResponse?.message || "Lỗi tải thông tin người dùng");
      return;
    }

    const userData = userDataResponse.data;
    const formValues = {
      code: userData.code,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      description: userData.description,
      userName: userData.userName,
      roleId: userData.roleId,
      gender:
        userData.gender === true
          ? "male"
          : userData.gender === false
          ? "female"
          : "other",
      birthDate: userData.dateBirth
        ? dayjs(userData.dateBirth, "YYYY-MM-DD HH:mm:ss")
        : null,
    };
    // setGender(userData.gender === true ? "male" : (userData.gender === false ? "female" : "other")); // Không cần nếu form xử lý

    if (userData.address && userData.address.length > 0) {
      const addressesWithFetchedData = await Promise.all(
        userData.address.map(async (addr) => {
          let fetchedDistricts = [];
          let fetchedWards = [];
          let provName = addr.provinceName,
            distName = addr.districtName,
            wardName = addr.wardName;

          if (addr.provinceId) {
            if (!provName && provinces.length > 0)
              provName = provinces.find(
                (p) => p.value === addr.provinceId
              )?.label;
            try {
              const districtResp = await getDistrict({
                code: addr.provinceId,
                name: null,
              });
              if (districtResp.success && districtResp.data) {
                const districtArr = Array.isArray(districtResp.data)
                  ? districtResp.data
                  : districtResp.data.data &&
                    Array.isArray(districtResp.data.data)
                  ? districtResp.data.data
                  : [];
                fetchedDistricts = districtArr.map((d) => ({
                  code: d.code,
                  name: d.name,
                }));
                if (addr.districtId && !distName)
                  distName = fetchedDistricts.find(
                    (d) => d.code === addr.districtId
                  )?.name;
              }
            } catch (e) {
              console.error("Error fetching districts for user address", e);
            }
          }
          if (addr.districtId) {
            if (!distName && fetchedDistricts.length > 0)
              distName = fetchedDistricts.find(
                (d) => d.code === addr.districtId
              )?.name;
            try {
              const wardResp = await getWard({
                districtCode: addr.districtId,
                name: null,
              });
              if (wardResp.success && wardResp.data) {
                const wardArr = Array.isArray(wardResp.data)
                  ? wardResp.data
                  : wardResp.data.data && Array.isArray(wardResp.data.data)
                  ? wardResp.data.data
                  : [];
                fetchedWards = wardArr.map((w) => ({
                  code: w.code,
                  name: w.name,
                }));
                if (addr.wardId && !wardName)
                  wardName = fetchedWards.find(
                    (w) => w.code === addr.wardId
                  )?.name;
              }
            } catch (e) {
              console.error("Error fetching wards for user address", e);
            }
          }
          if (addr.wardId && !wardName && fetchedWards.length > 0)
            wardName = fetchedWards.find((w) => w.code === addr.wardId)?.name;

          return {
            ...addr,
            stage: addr.stage !== undefined ? addr.stage : 1,
            districts: fetchedDistricts,
            wards: fetchedWards,
            visiable: true,
            provinceName: provName,
            districtName: distName,
            wardName: wardName,
          };
        })
      );
      setAddressList(addressesWithFetchedData);
      formValues.address = addressesWithFetchedData.map((addr) => ({
        provinceId: addr.provinceId,
        districtId: addr.districtId,
        wardId: addr.wardId,
        addressDetail: addr.addressDetail,
        isDefault: addr.isDefault,
      }));
    } else {
      const defaultAddr = [{ ...initialAddressEntry(), isDefault: 1 }];
      setAddressList(defaultAddr);
      formValues.address = defaultAddr.map((addr) => ({
        provinceId: addr.provinceId,
        districtId: addr.districtId,
        wardId: addr.wardId,
        addressDetail: addr.addressDetail,
        isDefault: addr.isDefault,
      }));
    }
    form.setFieldsValue(formValues);
    if (userData.imageUrl) handleConvert(userData.imageUrl);
    else setFileList([]);
  };

  const fetchProvinces = async () => {
    console.log("[UserForm PROVINCES] Fetching provinces...");
    const responseFromHook = await getProvince({ name: null }); // Giữ nguyên tên biến để rõ ràng
    console.log(
      "[UserForm PROVINCES] RAW API Response for getProvince (Hook Response):",
      JSON.stringify(responseFromHook, null, 2)
    );

    if (responseFromHook && responseFromHook.success) {
      // Request HTTP thành công
      const backendResponse = responseFromHook.data; // Đây là response thực sự từ BE

      if (backendResponse && backendResponse.success) {
        // BE xử lý thành công
        let provincesArray = null;
        if (backendResponse.data && Array.isArray(backendResponse.data)) {
          // Trường hợp 1: Mảng tỉnh trong BE_response.data
          provincesArray = backendResponse.data;
          console.log(
            "[UserForm PROVINCES] Provinces array found in BE_response.data"
          );
        }
        // Bỏ trường hợp BE_response.data.data nếu API tỉnh không có cấu trúc đó
        // else if (backendResponse.data && backendResponse.data.data && Array.isArray(backendResponse.data.data)) {
        //   provincesArray = backendResponse.data.data;
        //   console.log("[UserForm PROVINCES] Provinces array found in BE_response.data.data");
        // }

        if (provincesArray && provincesArray.length > 0) {
          setProvinces(
            provincesArray.map((p) => ({
              code: p.code,
              name: p.name,
              value: p.code,
              label: p.name,
            }))
          );
          // Có thể không cần toast gì ở đây, hoặc toast.success nếu muốn
          // toast.success("Tải danh sách tỉnh/thành phố thành công!");
          console.log("[UserForm PROVINCES] Provinces set successfully.");
        } else {
          setProvinces([]);
          // BE trả về thành công nhưng danh sách trống hoặc cấu trúc data không đúng
          console.warn(
            "[UserForm PROVINCES] Provinces array from BE is empty or not found in expected structure. BE Data:",
            backendResponse.data
          );
          // Chỉ toast message từ BE nếu nó không phải là message thành công mặc định
          if (
            backendResponse.message &&
            backendResponse.message !== "Thành công" &&
            backendResponse.message !==
              "Lấy danh sách tỉnh/thành phố thành công"
          ) {
            toast.info(backendResponse.message); // Dùng toast.info cho trường hợp danh sách trống
          }
        }
      } else {
        // BE xử lý không thành công (ví dụ: BE trả về success: false)
        console.error(
          "[UserForm PROVINCES] BE processing error. BE Response:",
          backendResponse
        );
        setProvinces([]);
        toast.error(
          backendResponse?.message || "Lỗi từ máy chủ khi tải tỉnh/thành phố."
        );
      }
    } else {
      // Request HTTP thất bại (lỗi từ hook useRequest)
      console.error(
        "[UserForm PROVINCES] HTTP request failed. Hook Response:",
        responseFromHook
      );
      setProvinces([]);
      toast.error(
        responseFromHook?.message ||
          "Lỗi mạng hoặc không thể kết nối để tải tỉnh/thành phố."
      );
    }
  };

 const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // --- PHẦN SỬA ĐỔI BẮT ĐẦU TỪ ĐÂY ---

      // 1. Lấy dữ liệu địa chỉ trực tiếp từ form mà Ant Design đang quản lý
      const formAddresses = form.getFieldValue('address') || []; 
      
      // 2. Kết hợp dữ liệu từ form với thông tin 'stage' và 'isDefault' từ 'addressList' state
      //    và chỉ lấy các địa chỉ đang hoạt động (stage === 1)
      const activeCombinedAddresses = addressList
        .map((addrState, index) => {
          // Lấy dữ liệu từ form cho địa chỉ tại index này
          const formAddressData = formAddresses[index] || {};
          return {
            // Giữ lại các thông tin từ state mà form không quản lý trực tiếp
            id: addrState.id,
            stage: addrState.stage,
            isDefault: addrState.isDefault,
            districts: addrState.districts, // Giữ lại danh sách quận/huyện đã fetch
            wards: addrState.wards,         // Giữ lại danh sách phường/xã đã fetch
            provinceName: addrState.provinceName, // Có thể cập nhật lại từ form nếu cần
            districtName: addrState.districtName,
            wardName: addrState.wardName,

            // Ghi đè/lấy các giá trị từ form (đây là dữ liệu người dùng đã nhập mới nhất)
            provinceId: formAddressData.provinceId,
            districtId: formAddressData.districtId,
            wardId: formAddressData.wardId,
            addressDetail: formAddressData.addressDetail,
          };
        })
        .filter(addr => addr.stage === 1); // Chỉ xử lý các địa chỉ đang hoạt động

      // 3. Kiểm tra điều kiện trên 'activeCombinedAddresses' (đã chứa dữ liệu mới nhất từ form)
      if (activeCombinedAddresses.some(addr => !addr.provinceId || !addr.districtId || !addr.wardId || !addr.addressDetail?.trim())) { 
          toast.error("Vui lòng điền đầy đủ thông tin Tỉnh/Thành, Quận/Huyện, Phường/Xã và Địa chỉ chi tiết cho tất cả các địa chỉ đang hoạt động."); 
          return; 
      }
      if (activeCombinedAddresses.length > 0 && !activeCombinedAddresses.some(addr => addr.isDefault === 1)) { 
          toast.error("Vui lòng chọn một địa chỉ làm mặc định."); 
          return; 
      }

      // 4. Tạo payload để gửi đi API từ 'activeCombinedAddresses'
      const addressModelPayload = activeCombinedAddresses.map(addrItem => {
        const prov = provinces.find(p => p.value === addrItem.provinceId); 
        const dist = addrItem.districts.find(d => d.code === addrItem.districtId);
        const ward = addrItem.wards.find(w => w.code === addrItem.wardId);
        return { 
            id: addrItem.id, 
            provinceId: addrItem.provinceId, 
            districtId: addrItem.districtId, 
            wardId: addrItem.wardId, 
            addressDetail: addrItem.addressDetail, 
            provinceName: prov?.label || addrItem.provinceName, 
            districtName: dist?.name || addrItem.districtName, 
            wardName: ward?.name || addrItem.wardName, 
            stage: 1, 
            isDefault: addrItem.isDefault 
        };
      });

      // --- PHẦN SỬA ĐỔI KẾT THÚC Ở ĐÂY ---

      // Phần còn lại của onFinish (tạo modelPayload, formData, gọi API) giữ nguyên
      const modelPayload = { 
          code: values.code, 
          fullName: values.fullName, 
          phoneNumber: values.phoneNumber, 
          email: values.email, 
          dateBirth: values.birthDate ? values.birthDate.format("YYYY-MM-DD HH:mm:ss") : null, 
          userName: values.userName, 
          gender: values.gender === "male" ? true : (values.gender === "female" ? false : null), 
          address: addressModelPayload, // Sử dụng addressModelPayload đã được tạo ở trên
          roleId: 5, // Giả sử roleId cho khách hàng là 5
          description: values.description, 
          status: 1, 
          id: modelItem ? modelItem.id : null 
      };
      formData.append("model", JSON.stringify(modelPayload));
      if (fileList.length > 0 && fileList[0].originFileObj) {
          formData.append(`files`, fileList[0].originFileObj);
      }

      const apiResponse = await addOrChange(formData, { "Content-Type": "multipart/form-data" }, modelItem?.id);
      console.log("[UserForm SUBMIT] API Response:", JSON.stringify(apiResponse, null, 2));

      if (apiResponse && apiResponse.success === true) {
        setModal2Open(false);
        toast.success(apiResponse.message || (modelItem ? "Cập nhật thành công!" : "Thêm mới thành công!"));
        if (fetchData) fetchData();
        resetModalState();
      } else {
        toast.error(apiResponse?.message || "Có lỗi xảy ra khi lưu dữ liệu.");
      }
    } catch (error) { 
        console.error("Lỗi chi tiết:", error); 
        toast.error("Lỗi hệ thống, vui lòng thử lại!"); 
    }
  };

  const onFinishFailed = (errInfo) => {
    console.log("Thất bại:", errInfo);
    toast.error("Vui lòng kiểm tra lại các trường thông tin!");
  };
  const addressDefaultChange = (e, idx) => {
    e.preventDefault();
    setAddressList(
      addressList.map((model, i) => ({
        ...model,
        isDefault: i === idx ? 1 : 0,
      }))
    );
  };

  const onHandleDeleteAddress = (idx) => {
    const newList = addressList.map((model, i) =>
      i === idx ? { ...model, stage: -1 } : model
    );
    const activeAddrs = newList.filter((addr) => addr.stage === 1);
    if (
      activeAddrs.length > 0 &&
      !activeAddrs.some((addr) => addr.isDefault === 1)
    ) {
      const firstActiveIdx = newList.findIndex((addr) => addr.stage === 1);
      if (firstActiveIdx !== -1) newList[firstActiveIdx].isDefault = 1;
    }
    if (activeAddrs.length === 0) {
      setAddressList([{ ...initialAddressEntry(), isDefault: 1 }]);
    } else {
      setAddressList(newList);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleConvert = async (url) => {
    if (!url) return;
    try {
      setFileList([]);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Không thể tải tệp");
      const blob = await resp.blob();
      const fName = url.split("/").pop() || `image_${Date.now()}.jpg`;
      const file = new File([blob], fName, { type: blob.type });
      setFileList([
        {
          uid: Date.now().toString(),
          name: fName,
          status: "done",
          url: URL.createObjectURL(file),
          originFileObj: file,
        },
      ]);
    } catch (err) {
      toast.error("Không thể tải ảnh từ URL.");
    }
  };
  const handleChangeFile = ({ fileList: newFiles }) => {
    const latest = newFiles.slice(-1);
    latest.forEach((item) => (item.status = "done"));
    setFileList(latest);
  };

  const resetModalState = () => {
    form.resetFields();
    setFileList([]); // setGender(""); // Không cần nếu form xử lý
    const initAddrArr = [{ ...initialAddressEntry(), isDefault: 1 }];
    setAddressList(initAddrArr);
    form.setFieldsValue({
      address: initAddrArr.map((addr) => ({
        provinceId: addr.provinceId,
        districtId: addr.districtId,
        wardId: addr.wardId,
        addressDetail: addr.addressDetail,
        isDefault: addr.isDefault,
      })),
    });
  };

  const handleOpenModal = () => {
    resetModalState();
    fetchProvinces(); // Gọi fetchProvinces ở đây
    if (modelItem?.id) {
      fetchUserById();
    } else {
      fetchGenerateCode();
    }
    setModal2Open(true);
  };

  const handleInputChange = (e, idx) => {
    const { value } = e.target;
    const updForms = [...addressList];
    updForms[idx] = { ...updForms[idx], addressDetail: value };
    setAddressList(updForms);
  };
  const handleModalCancel = () => {
    setModal2Open(false);
    resetModalState();
  };

  useEffect(() => {
    if (modal2Open && !modelItem?.id) {
      const currentFormAddresses = form.getFieldValue("address") || [];
      if (
        currentFormAddresses.length !==
        addressList.filter((a) => a.stage === 1).length
      ) {
        form.setFieldsValue({
          address: addressList
            .filter((a) => a.stage === 1)
            .map((addr) => ({
              provinceId: addr.provinceId,
              districtId: addr.districtId,
              wardId: addr.wardId,
              addressDetail: addr.addressDetail,
              isDefault: addr.isDefault,
            })),
        });
      }
    }
  }, [modal2Open, addressList, form, modelItem]);

  return (
    <div>
      <Button
        type={"primary"}
        style={{
          alignItems: "center",
          background: modelItem ? "#1890ff" : "#1fbf39",
          color: "white",
          borderColor: modelItem ? "#1890ff" : "#1fbf39",
        }}
        onClick={handleOpenModal}
      >
        {textButton}
      </Button>
      <Modal
        width={"70%"}
        title={
          modelItem ? "Cập nhật thông tin người dùng" : "Thêm mới người dùng"
        }
        centered
        open={modal2Open}
        onCancel={handleModalCancel}
        footer={null}
        styles={{
          body: { overflowY: "auto", maxHeight: "calc(100vh - 210px)" },
        }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          scrollToFirstError
        >
          <br />
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <span
                className="hide-menu"
                style={{ fontSize: "14px", color: "black", fontWeight: "bold" }}
              >
                Thông tin cá nhân
              </span>
            </Col>
          </Row>
          <br />
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <Form.Item label="Ảnh đại diện" name="listFileImg">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onRemove={handleRemoveFile}
                  onPreview={handlePreview}
                  onChange={handleChangeFile}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: setPreviewOpen,
                      afterOpenChange: (vis) => !vis && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[24, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Mã người dùng"
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "Mã người dùng không được để trống!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Mã sẽ được tạo tự động"
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      {
                        type: "email",
                        message: "Vui lòng nhập đúng định dạng email",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập địa chỉ email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại phải là 10 chữ số",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Tên đăng nhập"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên đăng nhập",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên đăng nhập" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="birthDate"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh" },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày sinh"
                      format="DD/MM/YYYY"
                      disabledDate={(curr) =>
                        curr && curr > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn giới tính"
                      style={{ width: "100%" }}
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description">
                    <TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <br />
          <Row gutter={[24, 16]}>
            <Col xs={12} sm={8}>
              <span
                className="hide-menu"
                style={{ fontSize: "14px", color: "black", fontWeight: "bold" }}
              >
                Địa chỉ liên hệ
              </span>
            </Col>
         
          </Row>
          <br />
          <Form.List name="address">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => {
                  const currentAddressState = addressList[index] || {};
                  if (currentAddressState.stage !== 1) return null;

                  return (
                    <Card
                      key={key}
                      style={{ marginBottom: 16 }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <Row gutter={[16, 0]} align="middle">
                        <Col flex="auto">
                          <span
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                          >
                            Địa chỉ {index + 1}
                          </span>
                        </Col>
                        <Col style={{ textAlign: "right" }}>
                          <Button
                            type="text"
                            icon={
                              <Star
                                size={20}
                                fill={
                                  currentAddressState.isDefault === 1
                                    ? "orange"
                                    : "transparent"
                                }
                                stroke={
                                  currentAddressState.isDefault === 1
                                    ? "orange"
                                    : "currentColor"
                                }
                              />
                            }
                            onClick={(e) => addressDefaultChange(e, index)}
                            title={
                              currentAddressState.isDefault === 1
                                ? "Địa chỉ mặc định"
                                : "Đặt làm mặc định"
                            }
                          />
                          {addressList.filter((addr) => addr.stage === 1)
                            .length > 1 && (
                            <Button
                              type="text"
                              danger
                              icon={<Trash2 size={20} />}
                              onClick={() => {
                                // Khi xóa, gọi hàm remove của Form.List trước
                                remove(name); // `name` ở đây là index của field trong form
                                // Sau đó cập nhật state addressList của bạn
                                onHandleDeleteAddress(index);
                              }}
                              title="Xóa địa chỉ này"
                            />
                          )}
                        </Col>
                      </Row>
                      <Row gutter={[16, 0]}>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "provinceId"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn tỉnh/thành",
                              },
                            ]}
                          >
                            <Select
                              placeholder={
                                currentAddressState.provinceName ||
                                "Chọn Tỉnh/Thành phố"
                              }
                              onChange={(val) =>
                                handleSelectedChange(val, index, "provinceId")
                              }
                              style={{ width: "100%" }}
                              showSearch
                              filterOption={(inp, opt) =>
                                (opt?.label ?? "")
                                  .toLowerCase()
                                  .includes(inp.toLowerCase())
                              }
                              options={provinces} // provinces state của bạn
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "districtId"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn quận/huyện",
                              },
                            ]}
                          >
                            <Select
                              placeholder={
                                currentAddressState.districtName ||
                                "Chọn Quận/Huyện"
                              }
                              onChange={(val) =>
                                handleSelectedChange(val, index, "districtId")
                              }
                              style={{ width: "100%" }}
                              disabled={
                                !currentAddressState.provinceId ||
                                currentAddressState.districts?.length === 0
                              }
                              showSearch
                              filterOption={(inp, opt) =>
                                (opt?.label ?? "")
                                  .toLowerCase()
                                  .includes(inp.toLowerCase())
                              }
                              options={
                                currentAddressState.districts?.map((d) => ({
                                  value: d.code,
                                  label: d.name,
                                })) || []
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "wardId"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn phường/xã",
                              },
                            ]}
                          >
                            <Select
                              placeholder={
                                currentAddressState.wardName || "Chọn Phường/Xã"
                              }
                              onChange={(val) =>
                                handleSelectedChange(val, index, "wardId")
                              }
                              style={{ width: "100%" }}
                              disabled={
                                !currentAddressState.districtId ||
                                currentAddressState.wards?.length === 0
                              }
                              showSearch
                              filterOption={(inp, opt) =>
                                (opt?.label ?? "")
                                  .toLowerCase()
                                  .includes(inp.toLowerCase())
                              }
                              options={
                                currentAddressState.wards?.map((w) => ({
                                  value: w.code,
                                  label: w.name,
                                })) || []
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            {...restField}
                            name={[name, "addressDetail"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập địa chỉ chi tiết",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Số nhà, tên đường, tòa nhà,..."
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}

                {/* Nút "Thêm địa chỉ" được đặt ở đây, bên trong render prop của Form.List */}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      // 1. Gọi hàm add() của Form.List để Antd thêm một bộ field mới vào form
                      // Hàm add() có thể nhận một giá trị khởi tạo cho field mới nếu cần
                      add();

                      // 2. Đồng thời, cập nhật addressList state của bạn để cung cấp dữ liệu cho UI
                      const hasDefault = addressList.some(
                        (addr) => addr.isDefault === 1 && addr.stage === 1
                      );
                      const newAddressEntry = {
                        ...initialAddressEntry(),
                        isDefault: hasDefault ? 0 : 1,
                      };
                      setAddressList((prev) => [...prev, newAddressEntry]);
                    }}
                    block
                    icon={<PlusSquareOutlined />}
                  >
                    Thêm địa chỉ
                  </Button>
                </Form.Item>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
          <Col span={24} style={{ textAlign: "right", marginTop: "20px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={form.isSubmitting}
            >
              {modelItem ? "Lưu thay đổi" : "Thêm người dùng"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleModalCancel}>
              Hủy
            </Button>
          </Col>
        </Form>
      </Modal>
    </div>
  );
};
export default UserAddOrChange;
