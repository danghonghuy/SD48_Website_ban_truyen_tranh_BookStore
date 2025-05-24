import useBranch from "@api/useBranch";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState, useCallback } from "react"; // Thêm useCallback
// import { useParams } from "react-router-dom"; // Không thấy dùng params ở đây
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function EditBranch({ id, state, action }) {
    const { getBranchById, editBranch } = useBranch(); // Gọi useBranch một lần
    const [branch, setBranch] = useState(null); // Khởi tạo là null để dễ kiểm tra
    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // Thêm state loading

    const fetchBranch = useCallback(async () => {
        if (!id) return; // Không fetch nếu không có id
        setLoading(true);
        try {
            const response = await getBranchById({ id: id });
            // Kiểm tra response cẩn thận hơn
            if (response && response.success && response.data) {
                setBranch(response.data); // Giả sử response.data là object branch
                // Nếu response.data.data mới là object branch: setBranch(response.data.data);
            } else {
                toast.error(response?.data?.message || response?.message || "Failed to fetch branch details.");
                setBranch(null); // Reset nếu lỗi
            }
        } catch (error) {
            toast.error(error?.message || "An error occurred while fetching branch details.");
            setBranch(null);
        } finally {
            setLoading(false);
        }
    }, [id, getBranchById]); // Thêm getBranchById vào dependencies

    useEffect(() => {
        // Chỉ fetch khi modal sắp mở và chưa có dữ liệu branch hoặc id thay đổi
        // Hoặc bạn có thể fetch luôn khi component mount nếu id luôn có sẵn
        if (id) { // Nếu id luôn được truyền vào và không đổi, có thể fetch ngay
             fetchBranch();
        }
    }, [id, fetchBranch]); // Fetch lại nếu id hoặc fetchBranch thay đổi

    // Sử dụng useEffect để set giá trị cho form khi `branch` có dữ liệu và modal mở
    useEffect(() => {
        if (branch && modal2Open) {
            form.setFieldsValue({
                branchName: branch.branchName,
                // Thêm các trường khác ở đây nếu có
                // code: branch.code,
                // address: branch.address,
            });
        }
        // Nếu muốn reset form khi modal đóng (tùy chọn)
        // if (!modal2Open) {
        //     form.resetFields();
        // }
    }, [branch, modal2Open, form]);

    const handleOpenModal = () => {
        // Có thể fetch lại dữ liệu ở đây nếu muốn đảm bảo dữ liệu luôn mới nhất khi mở modal
        // Hoặc nếu bạn đã fetch khi id thay đổi thì không cần thiết
        if (id && !branch) { // Nếu chưa có branch data thì fetch
            fetchBranch();
        } else if (branch) { // Nếu đã có branch data, set form fields
             form.setFieldsValue({
                branchName: branch.branchName,
            });
        }
        setModal2Open(true);
    };

    const handleCancelModal = () => {
        setModal2Open(false);
        // form.resetFields(); // Tùy chọn: reset form khi đóng modal
    };

    const onFinish = async (values) => {
        if (!branch || !branch.id) {
            toast.error("Branch ID is missing. Cannot update.");
            return;
        }
        setLoading(true);
        try {
            const response = await editBranch(values, { id: branch.id }); // Truyền id đúng cách
            if (response && response.success && response.data?.status !== 'Error') { // Kiểm tra response.data.status
                toast.success(response.data?.message || "Branch updated successfully!");
                setModal2Open(false); // Đóng modal sau khi thành công
                if (typeof action === 'function') {
                    action(!state); // Gọi action để refresh list (nếu cần)
                }
            } else {
                toast.error(response?.data?.message || response?.message || "Failed to update branch.");
            }
        } catch (error) {
            toast.error(error?.message || "An error occurred while updating branch.");
        } finally {
            setLoading(false);
        }
    };

    // onFinishFailed không cần thiết nếu bạn dùng validation của Form.Item
    // const onFinishFailed = ({ errorFields }) => {
    //     // Antd tự hiển thị lỗi validation, bạn có thể toast thêm nếu muốn
    //     // errorFields.forEach(field => {
    //     //     field.errors.forEach(error => toast.error(error));
    //     // });
    // };

    // handleInputChange không còn cần thiết nếu dùng Form quản lý state
    // const handleInputChange = (e, keytype,type) => { ... }

    return (
        <>
            <Button
                type="primary"
                danger // "danger" thường dùng cho nút xóa, có thể bạn muốn style khác
                title='Edit Branch'
                style={{ backgroundColor: 'brown' }} // Cân nhắc dùng class CSS thay vì inline style
                onClick={handleOpenModal} // Sử dụng handleOpenModal
                loading={loading && !modal2Open} // Hiển thị loading khi đang fetch dữ liệu ban đầu
            >
                <FontAwesomeIcon icon={faPenToSquare} style={{ color: "white" }} />
            </Button>

            <Modal
                width={'50%'}
                title="Update branch"
                centered
                visible={modal2Open} // Sửa thành visible
                onCancel={handleCancelModal}
                confirmLoading={loading} // Hiển thị loading trên nút OK của Modal
                footer={[
                    <Button key="back" onClick={handleCancelModal} disabled={loading}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                        Update
                    </Button>,
                ]}
            >
                {/* Chỉ render Form khi có branch data để initialValues hoạt động tốt hơn,
                    hoặc dựa vào setFieldsValue */}
                {/* {branch ? ( */}
                    <Form
                        form={form} // Quan trọng: truyền form instance
                        // initialValues={branch} // initialValues có thể không cần nếu dùng setFieldsValue
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        layout="vertical"
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item
                                    label="Branch Name"
                                    name="branchName"
                                    rules={[{ required: true, message: 'Please input the branch name!' }]}
                                >
                                    <Input placeholder="Enter branch name" />
                                    {/* Không cần value và onChange ở đây nữa */}
                                </Form.Item>
                            </Col>
                            {/* Thêm các Form.Item khác cho các trường còn lại */}
                            {/* Ví dụ:
                            <Col span={8}>
                                <Form.Item
                                    label="Branch Code"
                                    name="code"
                                    rules={[{ required: true, message: 'Please input the branch code!' }]}
                                >
                                    <Input placeholder="Enter branch code" />
                                </Form.Item>
                            </Col>
                            */}
                        </Row>
                        {/* Nút submit đã được chuyển xuống footer của Modal */}
                        {/* <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Submit
                            </Button>
                        </Form.Item> */}
                    </Form>
                {/* ) : (
                    // Có thể hiển thị Spin hoặc thông báo loading khi branch chưa có
                    loading && <div style={{textAlign: 'center', padding: '20px'}}><Spin /></div>
                )} */}
            </Modal>
        </>
    );
}

export default EditBranch;