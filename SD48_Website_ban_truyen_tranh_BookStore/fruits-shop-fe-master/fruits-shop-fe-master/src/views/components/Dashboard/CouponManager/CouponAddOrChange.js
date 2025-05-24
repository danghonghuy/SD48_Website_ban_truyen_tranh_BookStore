import { Button, Col, Form, Input, Modal, Row, Select, DatePicker, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useCoupon from "@api/useCoupons";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const CouponAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const { generateCode, addOrChange } = useCoupon();
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const [typeId, setTypeId] = useState(null);

  useEffect(() => {
    if (modelItem && modal2Open) {
      const dayjsStartDate = modelItem.dateStart ? dayjs(modelItem.dateStart) : undefined;
      const dayjsEndDate = modelItem.dateEnd ? dayjs(modelItem.dateEnd) : undefined;

      setTypeId(modelItem.type);
      form.setFieldsValue({
        code: modelItem.code,
        name: modelItem.name,
        description: modelItem.description,
        typeId: modelItem.type,
        couponAmount: modelItem.couponAmount,
        percentValue: modelItem.percentValue,
        maxValue: modelItem.maxValue,
        minValue: modelItem.minValue,
        quantity: modelItem.quantity,
        dateStart: dayjsStartDate,
        dateEnd: dayjsEndDate,
      });
    } else if (!modelItem && modal2Open) {
      form.resetFields();
      setTypeId(null);
      fetchGenerateCode();
    }
  }, [modal2Open, modelItem, form]);

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode();
    if (data != null && success && data.data) {
      form.setFieldsValue({ code: data.data });
    }
  };

  const showModel = () => {
    setModal2Open(true);
  };

  const handleCancelModal = () => {
    setModal2Open(false);
    form.resetFields();
    setTypeId(null);
  };

  const onFinish = async (values) => {
    try {
      const objectModel = {
        name: values.name,
        description: values.description,
        type: values.typeId,
        percentValue: values.typeId === 1 ? values.percentValue : null,
        minValue: values.minValue,
        maxValue: values.typeId === 1 ? values.maxValue : null,
        dateStart: values.dateStart ? dayjs(values.dateStart).toISOString() : null,
        dateEnd: values.dateEnd ? dayjs(values.dateEnd).toISOString() : null,
        quantity: values.quantity,
        couponAmount: values.typeId === 2 ? values.couponAmount : null,
        status: 1,
        isDeleted: 0,
        id: modelItem ? modelItem.id : null,
        code: values.code,
      };
      
      const response = await addOrChange(objectModel);

      if (response.success) {
        handleCancelModal();
        toast.success(response.data?.message || (modelItem ? "Cập nhật thành công!" : "Thêm mới thành công!"));
        if (fetchData) fetchData();
      } else {
        toast.error(response.data?.message || response.message || "Thao tác thất bại.");
      }
    } catch (error) {
      console.error("Lỗi onFinish Coupon: ", error);
      toast.error("Đã có lỗi xảy ra khi thực hiện thao tác.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    errorInfo.errorFields.forEach(err => {
        toast.warn(err.errors[0]);
    });
  };

  const handleTypeChange = (value) => {
    setTypeId(value);
    if (value === 1) {
      form.setFieldsValue({ couponAmount: undefined });
    } else if (value === 2) {
      form.setFieldsValue({ percentValue: undefined, maxValue: undefined });
    }
  };

  const checkStartDate = (_, value) => {
    const endDateValue = form.getFieldValue('dateEnd');
    if (value && endDateValue && dayjs(value).isAfter(dayjs(endDateValue))) {
      return Promise.reject(new Error("Ngày bắt đầu phải trước hoặc cùng ngày kết thúc!"));
    }
    return Promise.resolve();
  };

  const checkEndDate = (_, value) => {
    const startDateValue = form.getFieldValue('dateStart');
    if (value && startDateValue && dayjs(value).isBefore(dayjs(startDateValue))) {
      return Promise.reject(new Error("Ngày kết thúc phải sau hoặc cùng ngày bắt đầu!"));
    }
    return Promise.resolve();
  };

  const commonInputNumberProps = {
    min: 0,
    style: { width: "100%", height: "40px" },
    formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value) => value.replace(/,/g, ''),
  };

  return (
    <div>
      <Button
        type={isStyle ? "primary" : "default"}
        size="small"
        style={isStyle ? { alignItems: "center", background: "#1fbf39", color: "white", width: "100%" } : null}
        onClick={showModel}
      >
        {textButton}
      </Button>
      <Modal
        width={"60%"}
        title={modelItem ? "Cập nhật phiếu giảm giá" : "Thêm mới phiếu giảm giá"}
        centered
        open={modal2Open}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          name="coupon_form"
        >
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Mã khuyến mại" name="code" rules={[{ required: true, message: "Vui lòng nhập mã phiếu giảm giá!" }]}>
                <Input placeholder="Mã tự động" readOnly={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên phiếu giảm giá" name="name" rules={[{ required: true, message: "Vui lòng nhập tên phiếu giảm giá!" }]}>
                <Input placeholder="Nhập tên phiếu giảm giá" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại khuyến mại" name="typeId" rules={[{ required: true, message: "Vui lòng chọn loại phiếu giảm giá!" }]}>
                <Select placeholder="Chọn loại khuyến mại" onChange={handleTypeChange} style={{ width: "100%" }} disabled={!!modelItem}>
                  <Option value={1}>Giảm phần trăm đơn hàng</Option>
                  <Option value={2}>Giảm tiền đơn hàng</Option>
                </Select>
              </Form.Item>
            </Col>
            {typeId === 2 && (
              <Col span={12}>
                <Form.Item label="Giá trị giảm (VNĐ)" name="couponAmount" rules={[{ required: true, message: "Vui lòng nhập số tiền giảm giá!" }, { type: 'number', min: 1, message: 'Số tiền giảm phải lớn hơn 0!'}]}>
                  <InputNumber placeholder="Nhập số tiền" {...commonInputNumberProps} />
                </Form.Item>
              </Col>
            )}
            {typeId === 1 && (
              <Col span={12}>
                <Form.Item label="Giá trị giảm (%)" name="percentValue" rules={[{ required: true, message: "Vui lòng nhập phần trăm giảm giá!" }, { type: 'number', min: 1, max: 100, message: 'Phần trăm giảm từ 1 đến 100!'}]}>
                  <InputNumber placeholder="Nhập phần trăm" min={1} max={100} style={{ width: "100%", height: "40px" }} />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item label="Giá trị đơn hàng tối thiểu (VNĐ)" name="minValue" rules={[{ required: true, message: "Vui lòng nhập giá trị tối thiểu!" }, { type: 'number', min: 0, message: 'Giá trị tối thiểu không hợp lệ!'}]}>
                <InputNumber placeholder="Nhập giá trị tối thiểu" {...commonInputNumberProps} />
              </Form.Item>
            </Col>
            {typeId === 1 && (
              <Col span={12}>
                <Form.Item label="Giá trị giảm tối đa (VNĐ)" name="maxValue" rules={[{ required: true, message: "Vui lòng nhập giá trị giảm tối đa!" }, { type: 'number', min: 1, message: 'Giá trị giảm tối đa phải lớn hơn 0!'}]}>
                  <InputNumber placeholder="Nhập giá trị tối đa" {...commonInputNumberProps} />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item label="Ngày bắt đầu" name="dateStart" rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }, { validator: checkStartDate }]} dependencies={['dateEnd']}>
                <DatePicker showTime={{ format: "HH:mm" }} format={"DD/MM/YYYY HH:mm"} style={{ width: "100%", height: "40px" }} placeholder="Chọn ngày bắt đầu"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày kết thúc" name="dateEnd" rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc!" }, { validator: checkEndDate }]} dependencies={['dateStart']}>
                <DatePicker showTime={{ format: "HH:mm" }} format={"DD/MM/YYYY HH:mm"} style={{ width: "100%", height: "40px" }} placeholder="Chọn ngày kết thúc"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: "Vui lòng nhập số lượng!" }, { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!'}]}>
                <InputNumber placeholder="Nhập số lượng" min={1} style={{ width: "100%", height: "40px" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={4} placeholder="Nhập mô tả (không bắt buộc)" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right', marginTop: 20 }}>
            <Button onClick={handleCancelModal} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {modelItem ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponAddOrChange;