import useOrder from "@api/useOrder";
import { render } from "@testing-library/react";
import {
    Button,
    Modal,
    Form,
    Row,
    Col,
    Input,
    Select,
    Space,
    Table,
    Tag,
    Dropdown,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "@api/useAuth";

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}
function DetailUser() {
    const params = useParams();
    const { getDetail, edit } = useOrder();

    const {getUserDetail} = useAuth();
    const [user,setUser] = useState({});    


    const [order, setOrders] = useState({});
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        const { success, data } = await getUserDetail({UserId: params.userId});
        if (success && data.status != "Error") {
            if (loading) {
                setLoading(false);
                toast.success(data.message);
            }
            setUser(data.data);
        } else {
            toast.error(data.message);
        }
    };

    const [modal2Open, setModal2Open] = useState(false);

    const [status, setStatus] = useState("");
    const handleSetStatus = async () => {
        const { success, data } = await edit({ id: order.id }, status);
        if (success && data.status != "Error") {
            // toast.success(data.message)
            toast.success("update order success");

            setTimeout(() => {
                setModal2Open(false);
                setLoading(false);
            }, 2500);
        } else {
            toast.error(data.message);
        }
    };
    const handChangeValue = (value) => {
        setStatus(value);
    };
    useEffect(() => {
        fetchData();
    }, [loading]);
    const columns = [
        {
            title: "Product",
            dataIndex: "productName",
            key: "name",
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "age",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "age",
            render: (_, record) => (
                <p>{formatCurrencyVND(record.count * record.price)}</p>
            ),
        },
    ];

    console.log(order);
    return (<div class="container py-5">
        <div class="row g-4 mb-5">
            <div class="col-lg-8 col-xl-9">
                <div class="row g-4">
                    <div class="col-lg-6">
    
                    <span style={{display: 'flex'}}>
                            <p style={{marginRight: '10px'}}>
                                Email:  
                            </p>
                            <p>
                                {user.email}
                            </p>
                        </span>
    
    
                        <span style={{display: 'flex'}}>
                            <p style={{marginRight: '10px'}}>
                            UserName:  
                            </p>
                            <p>
                                {user.userName}
                            </p>
                        </span>
    
                        <span style={{display: 'flex'}}>
                            <p style={{marginRight: '10px'}}>
                            PhoneNumber:  
                            </p>
                            <p>
                                {user.phoneNumber}
                            </p>
                        </span>
                        <span style={{display: 'flex'}}>
                            <p style={{marginRight: '10px'}}>
                                UserId:  
                            </p>
                            <p>
                                {user.id}
                            </p>
                        </span>
                        
    
                    </div>
                   
                </div>
            </div>
          
        </div>
    </div>
    );
}

export default DetailUser;
