import useBranch from "@api/useBranch";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
function PaymentEdit({id,state,action}) {
    const {getBranchById} = useBranch();
    const  {editBranch} = useBranch()
    const [branch,setBranch] = useState({})
    const fetchBranch = async () => {
        const {success,data} = await getBranchById({id: id})
        if(data.status != "Error" && success) {
            setBranch(data.data)
        } else {
            toast.error(data.message)
        }
    }
    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm()

    
    const onFinish = async (values) => {
      const {success,data} = await editBranch(values,{id: branch.id});
      if(success && data.status != 'Error') {
        toast.success(data.message);
        action(!state)
      } else {
        toast.error(data.message)
      }
    }
    const onFinishFailed = ({values,errorFields,outOfDate}) => {
      toast.error(errorFields)
    }
    const handleInputChange = (e, keytype,type) => {

        let v;
        if(type == "select" || type == "number") {
            v = e
        } else {
            const { value } = e.target;
            v = value
        }
        setBranch({ ...branch, [keytype]: v});
    }



    useEffect(() => {
        fetchBranch()
    }, [])
    return ( 
  <>
  <Button
      type="primary"
      danger
      title='Edit Branch' style={{
        backgroundColor: 'brown'
      }}
      onClick={() => setModal2Open(true)}
    >
      <FontAwesomeIcon icon={faPenToSquare} style={{color: "white"}} />
    </Button>

        <Modal
        width={'50%'}
        title="Update branch"
        centered
        visible={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <Form
          initialValues={branch}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Branch Name"
                name="branchName"
              >
                <Input value={branch.branchName}  onChange={(e) => handleInputChange(e, "branchName")}/>
              </Form.Item>
            </Col>      
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={onFinish} >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

</>
      
    );
}

export default PaymentEdit;