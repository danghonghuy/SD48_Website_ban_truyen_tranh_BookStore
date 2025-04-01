import useOrder from "@api/useOrder";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUser from "@store/useUser";
import { Button, Pagination, Space, Table } from "antd";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function History() {
    const {token} = useUser()
    const {getAll} = useOrder()
    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(true)
    const [total,setTotal] = useState()
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10
        }
    })
    

    const fetchData = async () => {
        const {success,data} = await getAll({
            ...tableParams.pagination,
            UserId: jwtDecode(token).user_id
        });

        if(success && data.status != 'Error') {
            if(data.data != null) {
                setOrder(data.data.items)
                setTotal(data.data.totalCount)
            }
            setLoading(false)
        }else {
            toast.error(data.message)
        }
    }
    useEffect(() => {
        fetchData()    
    }, [JSON.stringify(tableParams), loading])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
          });
          if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setOrder([]);
          }
    }

    const onShowSizeChange  = (current,pageSize) => {
        setTableParams({
            pagination: {
                pageIndex: current,
                pageSize: pageSize
            }
        })
    }
    const columns = [

        {
            title: 'FullName',
            render: (data) => {
                return (<p>{`${data.firstName} ${data.lastName}`}</p>)
            }
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Status',
            dataIndex: 'status',    
            key: 'status',
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, record) => <p >{record.totalPrice} đ</p>
        },
    ]
    return (

        <>
         <Table 
                dataSource={orders}   
                columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
        />

        <Pagination showSizeChanger
                onChange={onShowSizeChange} 
                style={{textAlign: 'center',marginTop: '1.5rem'}} 
                defaultCurrent={tableParams.pagination.pageIndex} 
                total={total}  />
        </>
       
    )
}






export default History;