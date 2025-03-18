import useProduct from "@api/useProduct";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

function Delete({id,state,action}) {
  const {deleteProduct} = useProduct();
  const [modal2Open, setModal2Open] = useState(false);
  const handleDelete = async () => {
    const {success,data} = await deleteProduct({id: id})
    if(success) {
        toast.success('Delete product successfully')
        
        setTimeout(() => {
          setModal2Open(false);
          action(!state)
        }, 3000);
    } else {
        toast.error(data.message)
    }
  }

    return ( 
      <>
            <div>
      <Button
        type="primary"
        danger
        title="Delete Product"
        onClick={() => setModal2Open(true)}
      >
          <FontAwesomeIcon icon={faTrash} />
      </Button>
      <Modal
        width={'30%'}
        centered
        visible={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <p title="center">Do you want to delete?</p>
        <Button type="primary" danger size="large" onClick={handleDelete}>
            Delete
        </Button>
      </Modal>
    </div>
        </>
    );
}

export default  Delete;