import { PlusSquareOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  DatePicker,
  Upload,
  Image,
  InputNumber,
  App,
  Spin,
} from "antd";
import React, { useEffect, useState, useCallback, useRef } from "react";
import useCategory from "@api/useCategory";
import useType from "@api/useType";
import useProduct from "@api/useProduct";
import useAuthor from "@api/useAuthor";
import usePublisher from "@api/usePublisher";
import useDistributor from "@api/useDistributor";
import { getMediaUrl } from "@constants/commonFunctions";
import dayjs from "dayjs";
import AddBranch from "../BranchManager/AddBranch";
import ProductTypeAdd from "../ProductType/ProductTypeAdd";
import AddAuthorModal from "./AddAuthorModal";
import AddPublisherModal from "./AddPublisherModal";
import AddDistributorModal from "./AddDistributorModal";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!(file instanceof File) && !(file instanceof Blob)) {
      return reject(
        new Error("Đối tượng truyền vào không phải là File hoặc Blob.")
      );
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const LoggedSelect = React.forwardRef((props, ref) => {
  const { parentKey, ...selectProps } = props;
  return <Select ref={ref} {...selectProps} />;
});

const AddProduct = ({ fetchData, modelItem, textButton, isStyle }) => {
  const { message: antdMessage } = App.useApp();
  const { generateCode, addOrChange, getById } = useProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { getListCategory } = useCategory();
  const { getListType } = useType();
  const { getListAuthors } = useAuthor();
  const { getListPublishers } = usePublisher();
  const { getListDistributors } = useDistributor();

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [allPublishers, setAllPublishers] = useState([]);
  const [allDistributors, setAllDistributors] = useState([]);

  const [loadingForm, setLoadingForm] = useState(false);
  const [productDataForEdit, setProductDataForEdit] = useState(null);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  const [formSetAttempt, setFormSetAttempt] = useState(0);

  const [isAddAuthorModalVisible, setIsAddAuthorModalVisible] = useState(false);
  const [isAddPublisherModalVisible, setIsAddPublisherModalVisible] =
    useState(false);
  const [isAddDistributorModalVisible, setIsAddDistributorModalVisible] =
    useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [isAddTypeModalVisible, setIsAddTypeModalVisible] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [fileListDelete, setFileListDelete] = useState([]);

  const fetchGenerateCodeInternal = useCallback(async () => {
    try {
      const response = await generateCode();
      if (response?.success && response.data?.data) {
        form.setFieldsValue({ code: response.data.data });
      } else {
        antdMessage.error(
          response?.data?.message ||
            response?.message ||
            "Lỗi khi tạo mã sản phẩm!"
        );
      }
    } catch (error) {
      antdMessage.error("Lỗi kết nối khi tạo mã sản phẩm!");
    }
  }, [generateCode, form, antdMessage]);

  const mapToOptions = useCallback((item) => {
    return { value: item.id, label: item.name };
  }, []);

  const processDropdownResponse = useCallback(
    (response, setter, entityName) => {
      let success = false;
      if (
        response?.success &&
        response.data?.data &&
        Array.isArray(response.data.data)
      ) {
        const mappedOptions = response.data.data.map(mapToOptions);
        setter(mappedOptions);
        success = true;
      } else if (response?.success && Array.isArray(response.data)) {
        const mappedOptions = response.data.map(mapToOptions);
        setter(mappedOptions);
        success = true;
      } else {
        setter([]);
        if (
          response &&
          !response.success &&
          (response.message || response.data?.message)
        )
          antdMessage.error(response.message || response.data.message);
        else if (response && !response.success)
          antdMessage.error(`Lỗi tải ${entityName}: Dữ liệu không hợp lệ.`);
      }
      return success;
    },
    [antdMessage, mapToOptions]
  );

  const fetchDropdownDataInternal = useCallback(async () => {
    setDropdownsLoaded(false);
    let allSuccess = true;
    try {
      const commonParams = { pageIndex: 0, pageSize: 500 };
      const categoryParams = { ...commonParams, status: 1 };
      const typeParams = { ...commonParams, status: 1 };

      const results = await Promise.allSettled([
        getListCategory(categoryParams),
        getListType(typeParams),
        getListAuthors(commonParams),
        getListPublishers(commonParams),
        getListDistributors(commonParams),
      ]);

      const [catRes, typeRes, authorRes, pubRes, distRes] = results.map((r) =>
        r.status === "fulfilled"
          ? r.value
          : {
              success: false,
              message:
                r.reason?.message ||
                `API ${r.reason?.config?.url || "unknown"} failed`,
            }
      );

      allSuccess =
        processDropdownResponse(catRes, setCategories, "Thể loại") &&
        allSuccess;
      allSuccess =
        processDropdownResponse(typeRes, setTypes, "Gói bán") && allSuccess;
      allSuccess =
        processDropdownResponse(authorRes, setAllAuthors, "Tác giả") &&
        allSuccess;
      allSuccess =
        processDropdownResponse(pubRes, setAllPublishers, "Nhà xuất bản") &&
        allSuccess;
      allSuccess =
        processDropdownResponse(distRes, setAllDistributors, "Nhà phát hành") &&
        allSuccess;
    } catch (error) {
      antdMessage.error("Lỗi nghiêm trọng khi tải dữ liệu cho các lựa chọn!");
      setCategories([]);
      setTypes([]);
      setAllAuthors([]);
      setAllPublishers([]);
      setAllDistributors([]);
      allSuccess = false;
    } finally {
      setDropdownsLoaded(true);
    }
    return allSuccess;
  }, [
    getListCategory,
    getListType,
    getListAuthors,
    getListPublishers,
    getListDistributors,
    antdMessage,
    processDropdownResponse,
  ]);

  const convertUrlToFileObject = useCallback(
    async (imageInfo, index) => {
      try {
        if (!imageInfo || !imageInfo.imageUrl) return null;
        const fullImageUrl = imageInfo.imageUrl.includes("http")
          ? imageInfo.imageUrl
          : getMediaUrl(imageInfo.imageUrl);
        const response = await fetch(fullImageUrl);
        if (!response.ok)
          throw new Error(
            `Tải tệp thất bại: ${fullImageUrl} - Status: ${response.status}`
          );
        const blob = await response.blob();
        const fileName =
          imageInfo.imageUrl.substring(
            imageInfo.imageUrl.lastIndexOf("/") + 1
          ) || `image_${imageInfo.id || index}.jpg`;
        const file = new File([blob], fileName, {
          type: blob.type || "image/jpeg",
        });
        return {
          type: "curr",
          uid: imageInfo.id
            ? `curr-${imageInfo.id}`
            : `new-curr-${index}-${Date.now()}`,
          id: imageInfo.id,
          name: fileName,
          status: "done",
          url: fullImageUrl,
          originFileObj: file,
        };
      } catch (error) {
        antdMessage.error(
          `Không thể tải ảnh: ${imageInfo.imageUrl.substring(
            imageInfo.imageUrl.lastIndexOf("/") + 1
          )}`
        );
        return null;
      }
    },
    [antdMessage]
  );

  const fetchProductByIdInternal = useCallback(
    async (productId) => {
      try {
        const response = await getById(productId);
        if (response?.success && response.data?.data) {
          setProductDataForEdit(response.data.data);
          if (
            response.data.data.images &&
            response.data.data.images.length > 0
          ) {
            const activeImages = response.data.data.images.filter(
              (img) => img.isDeleted === 0
            );
            const convertedFiles = await Promise.all(
              activeImages.map(convertUrlToFileObject)
            );
            setFileList(convertedFiles.filter((file) => file !== null));
          } else {
            setFileList([]);
          }
        } else {
          antdMessage.error(
            response?.data?.message ||
              response?.message ||
              "Có lỗi xảy ra khi lấy dữ liệu sản phẩm."
          );
          setProductDataForEdit(null);
        }
      } catch (error) {
        antdMessage.error("Lỗi nghiêm trọng khi tải dữ liệu sản phẩm.");
        setProductDataForEdit(null);
      }
    },
    [getById, convertUrlToFileObject, antdMessage]
  );

  useEffect(() => {
    if (modalOpen && modelItem && productDataForEdit && dropdownsLoaded) {
      const fieldsToSet = {
        code: productDataForEdit.code,
        name: productDataForEdit.name,
        price: productDataForEdit.price,
        stock: productDataForEdit.stock,
        description: productDataForEdit.description,
        categoryId: productDataForEdit.categoryId,
        typeId: productDataForEdit.typeId,
        series: productDataForEdit.series,
        datePublish: productDataForEdit.datePublish
          ? dayjs(productDataForEdit.datePublish)
          : undefined,
        datePublic: productDataForEdit.datePublic
          ? dayjs(productDataForEdit.datePublic)
          : undefined,
        status:
          productDataForEdit.status !== undefined
            ? productDataForEdit.status
            : 1,
        authorIds: productDataForEdit.authors
          ? productDataForEdit.authors.map((a) => a.id)
          : [],
        publisherId: productDataForEdit.publisherInfo?.id,
        distributorId: productDataForEdit.distributorInfo?.id,
      };
      try {
        form.setFieldsValue(fieldsToSet);
        setFormSetAttempt((prev) => prev + 1);
      } catch (e) {
        console.error(
          "[EFFECT SET FORM] Lỗi trong khi form.setFieldsValue:",
          e
        );
      }
    }
  }, [
    modalOpen,
    modelItem,
    productDataForEdit,
    form,
    dropdownsLoaded,
    categories,
    types,
    allAuthors,
    allPublishers,
    allDistributors,
  ]);

  const showModal = useCallback(async () => {
    setModalOpen(true);
    form.resetFields();
    setFileList([]);
    setFileListDelete([]);
    setProductDataForEdit(null);
    setDropdownsLoaded(false);
    setFormSetAttempt(0);
    setLoadingForm(true);

    await fetchDropdownDataInternal();

    if (modelItem && modelItem.id) {
      await fetchProductByIdInternal(modelItem.id);
    } else {
      fetchGenerateCodeInternal();
      form.setFieldsValue({ status: 1 });
    }
    setLoadingForm(false);
  }, [
    modelItem,
    fetchProductByIdInternal,
    fetchDropdownDataInternal,
    fetchGenerateCodeInternal,
    form,
  ]);

  const handlePreview = async (file) => {
    let previewUrlToSet = file.url || file.thumbUrl;
    if (!previewUrlToSet && file.originFileObj instanceof File) {
      try {
        previewUrlToSet = await getBase64(file.originFileObj);
      } catch (e) {
        antdMessage.error("Không thể xem trước ảnh này.");
        return;
      }
    }
    if (!previewUrlToSet) {
      antdMessage.error("Không có ảnh xem trước cho file này.");
      return;
    }
    setPreviewImage(previewUrlToSet);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  const handleChangeFile = ({ fileList: newFileList }) =>
    setFileList(newFileList.slice(0, 5));

  const handleRemove = (fileToRemove) => {
    if (fileToRemove.type === "curr" && fileToRemove.id != null) {
      if (!fileListDelete.find((f) => f.id === fileToRemove.id)) {
        setFileListDelete((prev) => [
          ...prev,
          { id: fileToRemove.id, imageUrl: fileToRemove.url, isDeleted: 1 },
        ]);
      }
    }
    return true;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </button>
  );

  const onFinish = async (values) => {
    setLoadingForm(true);
    try {
      const formData = new FormData();
      const finalExistingImageInfos = [];
      const allImageIdsInCurrentFileList = new Set(
        fileList
          .filter((f) => f.type === "curr" && f.id != null)
          .map((f) => f.id)
      );
      fileList.forEach((file) => {
        if (file.type === "curr" && file.id != null) {
          finalExistingImageInfos.push({
            id: file.id,
            imageUrl: file.url ? file.url.replace(getMediaUrl(""), "") : null,
            isDeleted: 0,
          });
        }
      });
      fileListDelete.forEach((deletedFile) => {
        if (
          deletedFile.id != null &&
          !allImageIdsInCurrentFileList.has(deletedFile.id)
        ) {
          finalExistingImageInfos.push({
            id: deletedFile.id,
            imageUrl: deletedFile.imageUrl
              ? deletedFile.imageUrl.replace(getMediaUrl(""), "")
              : null,
            isDeleted: 1,
          });
        }
      });
      const productRequestData = {
        id: modelItem?.id || null,
        code: values.code,
        name: values.name,
        description: values.description,
        datePublish: values.datePublish
          ? dayjs(values.datePublish).format("YYYY-MM-DD")
          : null,
        price: parseFloat(values.price) || 0,
        stock: parseInt(values.stock) || 0,
        categoryId: values.categoryId,
        typeId: values.typeId,
        series: values.series,
        datePublic: values.datePublic
          ? dayjs(values.datePublic).format("YYYY-MM-DD")
          : null,
        status: values.status !== undefined ? values.status : 1,
        files: finalExistingImageInfos,
        authorIds: values.authorIds || [],
        publisherId: values.publisherId,
        distributorId: values.distributorId,
      };
      formData.append(
        "productData",
        new Blob([JSON.stringify(productRequestData)], {
          type: "application/json",
        })
      );
      const newFilesToUpload = fileList.filter(
        (f) =>
          f.originFileObj instanceof File &&
          f.status !== "done" &&
          f.type !== "curr"
      );
      if (newFilesToUpload.length > 0) {
        newFilesToUpload.forEach((file) =>
          formData.append("ListFileImg", file.originFileObj, file.name)
        );
      }
    const response = await addOrChange(formData);
      console.log("[SUBMIT FORM] Phản hồi từ addOrChange:", JSON.stringify(response, null, 2));
      console.log("[SUBMIT FORM] response?.success:", response?.success);
      // Bỏ console.log cho response.data?.success vì nó không tồn tại

      // SỬA ĐIỀU KIỆN Ở ĐÂY:
      if (response?.success) { // Chỉ cần kiểm tra response.success ở cấp ngoài là đủ
                               // Hoặc nếu muốn chắc chắn data có, có thể là: response?.success && response?.data
        console.log("[SUBMIT FORM] ĐIỀU KIỆN THÀNH CÔNG ĐÚNG -> Gọi antdMessage.success");
        antdMessage.success(
          response.data?.message || // Vẫn có thể lấy message từ response.data.message nếu BE có trả về
            response.message ||     // Hoặc message từ response.message
            (modelItem
              ? "Cập nhật sản phẩm thành công!"
              : "Thêm sản phẩm thành công!")
        );
        console.log("[SUBMIT FORM] Gọi setModalOpen(false)");
        setModalOpen(false);
        if (fetchData) {
          console.log("[SUBMIT FORM] Gọi fetchData()");
          fetchData();
        }
      } else {
        console.log("[SUBMIT FORM] ĐIỀU KIỆN THÀNH CÔNG SAI -> Gọi antdMessage.error");
        antdMessage.error(response?.data?.message || response?.message || "Thao tác thất bại từ server.");
      }
    } catch (error) {
      antdMessage.error(
        error.response?.data?.message ||
          error.message ||
          "Đã có lỗi không mong muốn xảy ra."
      );
    } finally {
      setLoadingForm(false);
    }
  };

  const checkDatePublic = (_, value) => {
    const publishDate = form.getFieldValue("datePublish");
    if (!value || !publishDate) return Promise.resolve();
    if (
      dayjs(value).isValid() &&
      dayjs(publishDate).isValid() &&
      dayjs(value).isBefore(dayjs(publishDate))
    ) {
      return Promise.reject(
        new Error("Ngày phát hành phải sau hoặc cùng ngày xuất bản!")
      );
    }
    return Promise.resolve();
  };

  const onFinishFailed = (errorInfo) => {
    antdMessage.error("Vui lòng kiểm tra lại các trường đã nhập!");
  };

  const createModalHandler =
    (setModalVisibleCb, formFieldToSet) => (newEntity) => {
      fetchDropdownDataInternal();
      if (newEntity?.id) {
        if (formFieldToSet === "authorIds") {
          const currentIds = form.getFieldValue(formFieldToSet) || [];
          if (!currentIds.includes(newEntity.id))
            form.setFieldsValue({
              [formFieldToSet]: [...currentIds, newEntity.id],
            });
        } else {
          form.setFieldsValue({ [formFieldToSet]: newEntity.id });
        }
      }
      setModalVisibleCb(false);
    };

  const handleOpenAddAuthorModal = () => setIsAddAuthorModalVisible(true);
  const handleCloseAddAuthorModal = () => setIsAddAuthorModalVisible(false);
  const handleAuthorAdded = createModalHandler(
    setIsAddAuthorModalVisible,
    "authorIds"
  );

  const handleOpenAddPublisherModal = () => setIsAddPublisherModalVisible(true);
  const handleCloseAddPublisherModal = () =>
    setIsAddPublisherModalVisible(false);
  const handlePublisherAdded = createModalHandler(
    setIsAddPublisherModalVisible,
    "publisherId"
  );

  const handleOpenAddDistributorModal = () =>
    setIsAddDistributorModalVisible(true);
  const handleCloseAddDistributorModal = () =>
    setIsAddDistributorModalVisible(false);
  const handleDistributorAdded = createModalHandler(
    setIsAddDistributorModalVisible,
    "distributorId"
  );

  const handleOpenAddCategoryModal = () => setIsAddCategoryModalVisible(true);
  const handleCloseAddCategoryModal = () => setIsAddCategoryModalVisible(false);
  const handleCategoryAdded = createModalHandler(
    setIsAddCategoryModalVisible,
    "categoryId"
  );

  const handleOpenAddTypeModal = () => setIsAddTypeModalVisible(true);
  const handleCloseAddTypeModal = () => setIsAddTypeModalVisible(false);
  const handleTypeAdded = createModalHandler(
    setIsAddTypeModalVisible,
    "typeId"
  );

  const commonSelectProps = (placeholder, optionsData) => ({
    placeholder,
    options: optionsData,
    allowClear: true,
    showSearch: true,
    style: { width: "100%" },
    loading: !dropdownsLoaded,
    filterOption: (input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
  });

  const handleModalCancel = () => {
    setModalOpen(false);
    setProductDataForEdit(null);
    setDropdownsLoaded(false);
    form.resetFields();
  };

  const getItemIdForKeys = () =>
    modelItem?.id || productDataForEdit?.id || "new";
  const categorySelectKey = `cat-${getItemIdForKeys()}-${
    categories.length
  }-${dropdownsLoaded}-${formSetAttempt}`;
  const typeSelectKey = `type-${getItemIdForKeys()}-${
    types.length
  }-${dropdownsLoaded}-${formSetAttempt}`;
  const authorSelectKey = `auth-${getItemIdForKeys()}-${
    allAuthors.length
  }-${dropdownsLoaded}-${formSetAttempt}`;
  const publisherSelectKey = `pub-${getItemIdForKeys()}-${
    allPublishers.length
  }-${dropdownsLoaded}-${formSetAttempt}`;
  const distributorSelectKey = `dist-${getItemIdForKeys()}-${
    allDistributors.length
  }-${dropdownsLoaded}-${formSetAttempt}`;

  return (
    <>
      <Button
        type={isStyle ? "primary" : "default"}
        size="small"
        style={
          isStyle
            ? {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1fbf39",
                width: "100%",
              }
            : {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
        }
        onClick={showModal}
        icon={modelItem ? null : <PlusSquareOutlined />}
      >
        {textButton}
      </Button>
      <Modal
        width={"70%"}
        title={modelItem ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
        centered
        open={modalOpen}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose
      >
        <Spin spinning={loadingForm}>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            initialValues={{ status: 1 }}
          >
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Mã sản phẩm"
                  name="code"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã sản phẩm!" },
                  ]}
                >
                  <Input placeholder="Mã sản phẩm tự động" readOnly />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={16}>
                <Form.Item
                  label="Tên truyện"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên truyện!" },
                  ]}
                >
                  <Input placeholder="Nhập tên truyện" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item label="Thể loại" required>
                  <Row gutter={8} wrap={false} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        name="categoryId"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn thể loại!",
                          },
                        ]}
                        noStyle
                      >
                        <LoggedSelect
                          key={categorySelectKey}
                          parentKey={categorySelectKey}
                          name="categoryId"
                          {...commonSelectProps("Chọn thể loại", categories)}
                        />
                      </Form.Item>
                    </Col>
                    <Col flex="none">
                      <Button
                        icon={<PlusOutlined />}
                        onClick={handleOpenAddCategoryModal}
                        style={{ borderColor: "#52c41a", color: "#52c41a" }}
                        type="dashed"
                        size="small"
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item label="Gói bán" required>
                  <Row gutter={8} wrap={false} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        name="typeId"
                        rules={[
                          { required: true, message: "Vui lòng chọn gói bán!" },
                        ]}
                        noStyle
                      >
                        <LoggedSelect
                          key={typeSelectKey}
                          parentKey={typeSelectKey}
                          name="typeId"
                          {...commonSelectProps("Chọn gói bán", types)}
                        />
                      </Form.Item>
                    </Col>
                    <Col flex="none">
                      <Button
                        icon={<PlusOutlined />}
                        onClick={handleOpenAddTypeModal}
                        style={{ borderColor: "#52c41a", color: "#52c41a" }}
                        type="dashed"
                        size="small"
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Tác giả" required>
                  <Row gutter={8} wrap={false} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        name="authorIds"
                        rules={[
                          { required: true, message: "Vui lòng chọn tác giả!" },
                        ]}
                        noStyle
                      >
                        <LoggedSelect
                          key={authorSelectKey}
                          parentKey={authorSelectKey}
                          name="authorIds"
                          mode="multiple"
                          {...commonSelectProps("Chọn tác giả", allAuthors)}
                        />
                      </Form.Item>
                    </Col>
                    <Col flex="none">
                      <Button
                        icon={<PlusOutlined />}
                        onClick={handleOpenAddAuthorModal}
                        style={{ borderColor: "#52c41a", color: "#52c41a" }}
                        type="dashed"
                        size="small"
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Nhà xuất bản" required>
                  <Row gutter={8} wrap={false} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        name="publisherId"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn nhà xuất bản!",
                          },
                        ]}
                        noStyle
                      >
                        <LoggedSelect
                          key={publisherSelectKey}
                          parentKey={publisherSelectKey}
                          name="publisherId"
                          {...commonSelectProps(
                            "Chọn nhà xuất bản",
                            allPublishers
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col flex="none">
                      <Button
                        icon={<PlusOutlined />}
                        onClick={handleOpenAddPublisherModal}
                        style={{ borderColor: "#52c41a", color: "#52c41a" }}
                        type="dashed"
                        size="small"
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Nhà phát hành" required>
                  <Row gutter={8} wrap={false} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        name="distributorId"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn nhà phát hành!",
                          },
                        ]}
                        noStyle
                      >
                        <LoggedSelect
                          key={distributorSelectKey}
                          parentKey={distributorSelectKey}
                          name="distributorId"
                          {...commonSelectProps(
                            "Chọn nhà phát hành",
                            allDistributors
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col flex="none">
                      <Button
                        icon={<PlusOutlined />}
                        onClick={handleOpenAddDistributorModal}
                        style={{ borderColor: "#52c41a", color: "#52c41a" }}
                        type="dashed"
                        size="small"
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Sê-ri" name="series">
                  <Input placeholder="Nhập tên sê-ri (nếu có)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Ngày xuất bản"
                  name="datePublish"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày xuất bản!" },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày xuất bản"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Ngày phát hành"
                  name="datePublic"
                  dependencies={["datePublish"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày phát hành!",
                    },
                    { validator: checkDatePublic },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày phát hành"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Giá sản phẩm"
                  name="price"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá truyện!" },
                    { type: "number", min: 0, message: "Giá không hợp lệ!" },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập giá"
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Số lượng tồn kho"
                  name="stock"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng!" },
                    {
                      type: "number",
                      min: 0,
                      message: "Số lượng không hợp lệ!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số lượng"
                    min={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn trạng thái"
                    options={[
                      { value: 1, label: "Hoạt động" },
                      { value: 0, label: "Không hoạt động" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <Input.TextArea
                    placeholder="Nhập mô tả chi tiết cho sản phẩm"
                    rows={3}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Hình ảnh (Tối đa 5 ảnh)" name="productImages">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChangeFile}
                    onRemove={handleRemove}
                    beforeUpload={() => false}
                    multiple
                    accept="image/png, image/jpeg, image/gif"
                  >
                    {fileList.length >= 5 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                  >
                    <img
                      alt="Xem trước"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
              <Button onClick={handleModalCancel} style={{ marginRight: 8 }}>
                {" "}
                Hủy{" "}
              </Button>
              <Button type="primary" htmlType="submit">
                {" "}
                {modelItem ? "Lưu thay đổi" : "Thêm mới"}{" "}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <AddAuthorModal
        visible={isAddAuthorModalVisible}
        onClose={handleCloseAddAuthorModal}
        onSuccess={handleAuthorAdded}
      />
      <AddPublisherModal
        visible={isAddPublisherModalVisible}
        onClose={handleCloseAddPublisherModal}
        onSuccess={handlePublisherAdded}
      />
      <AddDistributorModal
        visible={isAddDistributorModalVisible}
        onClose={handleCloseAddDistributorModal}
        onSuccess={handleDistributorAdded}
      />
      <AddBranch
        visible={isAddCategoryModalVisible}
        onClose={handleCloseAddCategoryModal}
        onSuccess={handleCategoryAdded}
        fetchData={fetchDropdownDataInternal}
      />
      <ProductTypeAdd
        visible={isAddTypeModalVisible}
        onClose={handleCloseAddTypeModal}
        onSuccess={handleTypeAdded}
        fetchData={fetchDropdownDataInternal}
      />
    </>
  );
};

const AddProductAppWrapper = (props) => (
  <App>
    <AddProduct {...props} />
  </App>
);
export default AddProductAppWrapper;
