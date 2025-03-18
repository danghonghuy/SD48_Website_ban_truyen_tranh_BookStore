import useProduct from "@api/useProduct";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Button,
    Cascader,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
    Row,Col
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import useBranch from "@api/useBranch";
import useOrigin from "@api/useOrigin";
function Edit() {

    const [product, setProduct] = useState({});


    
    const  {getAllById,editProduct} = useProduct()
    const {getAllBranch} = useBranch()
    const {getAllOrigin} = useOrigin()
    const [branch, setBranch] = useState([])
    const [origin, setOrigin] = useState([])



    const handleEdit = async () => {
      const {success,data}  =  await editProduct({...product,id: param.id});
      if(success) {
        toast.success(data.message)
    } else {
        toast.error(data.message)
    }
    }


  const fetchbranch = async () => {
    const {success, data} = await getAllBranch();

    if(data != null && success) {
      var databranch = data.data.map((items) => {
        return {
          value: items.id,
          label: items.branchName
        }
      });
      setBranch(databranch)
    }
  }


  const fetchOrigin = async () => {
    const { success,data} = await getAllOrigin();
    if(data != null && success) {
      var dataOrigin = data.data.map((items) => {
        return {
          value: items.id,
          label: items.originName
        }
      });
      setOrigin(dataOrigin)
    }
  }

    const param = useParams();
    const fetchData = async () => {
        const {success,data} = await getAllById(param.id)
        if(success && data.status != 'Error') {
            setProduct(data.data)
        } else {
            toast.error(data.message)
        }
    }
    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
    };

    useEffect(() => {
        fetchData()
        fetchOrigin()
        fetchbranch()
    }, [])



    

    const handleInputChange = (e, keytype,type) => {

        let v;
        if(type == "select" || type == "number") {
            v = e
        } else {
            const { value } = e.target;
            v = value
        }
        setProduct({ ...product, [keytype]: v});
    }

    const { RangePicker } = DatePicker;
    const { TextArea } = Input;
    return (
        
        <>
      <Form
        layout="horizontal"
        style={{
          maxWidth: '100%',
          paddingTop: '25px'
        }}
      >
        <Row gutter={[10,10]}>
            <Col span={8}>
                <Form.Item label="Name">
                 <Input value={product.productName} onChange={(e) => handleInputChange(e,"productName")} />
                </Form.Item>
            </Col>
{/* 
            <Col span={8}>
                <Form.Item label="Type">
                 <Input value={product.productType} onChange={(e) => handleInputChange(e,"productType")} />
                </Form.Item>
            </Col> */}
            <Col span={8}>
            <Form.Item label="Category">
          <Select placeholder="Select branch" value={product.branchId} options={branch} onChange={(e) => handleInputChange(e,"branchId", "select")} >
          </Select>
        </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item label="Brand">
          <Select placeholder="Select origin" value={product.originId} options={origin} onChange={(e) => handleInputChange(e,"originId", "select")} >
          </Select>
        </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item label="Quanlity">
          <InputNumber value={product.productQuanlity} onChange={(e) => handleInputChange(e, "productQuanlity","number")} />
        </Form.Item>
            </Col>

        {/* <Col span={6}>
            <Form.Item label="Material">
                <Input value={product.productMaterial} onChange={(e) => handleInputChange(e,"productMaterial")} />
            </Form.Item>
        </Col> */}

        <Col span={8}>
            <Form.Item label="Price">
                <InputNumber value={product.prodcutPrice} onChange={(e) => handleInputChange(e,"prodcutPrice","number")} />
            </Form.Item>
        </Col>

            <Col span={8}>
                <Form.Item label="Description">
                 <TextArea rows={3} value={product.productDescription} onChange={(e) => handleInputChange(e,"productDescription")} />
                </Form.Item>
            </Col>
           
        </Row>
        
        
       
      
        {/* <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <button
              style={{
                border: 0,
                background: 'none',
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          </Upload>
        </Form.Item> */}


        <Button type="primary" onClick={handleEdit}>Edit</Button>
      </Form>
    </>
    );
}

export default Edit;