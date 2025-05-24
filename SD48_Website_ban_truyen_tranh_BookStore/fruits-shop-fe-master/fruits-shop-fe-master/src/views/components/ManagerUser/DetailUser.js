import {
    Row,
    Col,
    Card,
    Descriptions,
    Spin,
    Avatar,
    Tag 
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "@api/useAuth";
import { UserOutlined } from '@ant-design/icons';

function DetailUser() {
    const params = useParams();
    const { getUserDetail } = useAuth();
    const [user, setUser] = useState({});    
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!params.userId) {
            toast.error("Không tìm thấy ID người dùng.");
            setLoading(false);
            return;
        }
        const { success, data } = await getUserDetail({ UserId: params.userId });
        if (success && data?.status !== "Error" && data?.data) {
            setUser(data.data);
        } else {
            toast.error(data?.message || "Không thể tải thông tin người dùng.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [params.userId]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <Spin size="large" tip="Đang tải thông tin người dùng..." />
            </div>
        );
    }

    if (!user || Object.keys(user).length === 0) {
        return (
            <div className="container py-5 text-center">
                <p>Không tìm thấy thông tin người dùng.</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <Row justify="center">
                <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                    <Card 
                        title={<h3 style={{ marginTop: 0, marginBottom: 0 }}>Chi Tiết Người Dùng</h3>}
                    >
                        <Row gutter={[16, 24]} align="middle">
                            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                                <Avatar 
                                    size={{ xs: 80, sm: 100, md: 120, lg: 140, xl: 150, xxl: 150 }} 
                                    icon={<UserOutlined />} 
                                    src={user.avatarUrl || null}
                                />
                                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{user.fullName || user.userName}</h4>
                                <p className="text-muted">{user.roleName || user.roleCode?.join(', ')}</p>
                            </Col>
                            <Col xs={24} sm={16}>
                                <Descriptions bordered column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }} layout="horizontal">
                                    <Descriptions.Item label="ID Người Dùng">
                                        {user.id || 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Tên đăng nhập">
                                        {user.userName || 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Họ và tên">
                                        {user.fullName || 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Email">
                                        {user.email || 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">
                                        {user.phoneNumber || 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">
                                        {user.address && user.address.length > 0 
                                            ? `${user.address[0].fullInfo || ''}, ${user.address[0].wardName || ''}, ${user.address[0].districtName || ''}, ${user.address[0].provinceName || ''}`.replace(/, ,/g,',').replace(/^,|,$/g,'').trim() || 'Chưa cập nhật'
                                            : 'Chưa cập nhật'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">
                                        {user.status === 1 ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Bị khóa</Tag>}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ngày tham gia">
                                        {user.createdDate ? new Date(user.createdDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DetailUser;