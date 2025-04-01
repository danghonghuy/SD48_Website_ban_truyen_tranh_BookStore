import useBranch from "@api/useBranch";
import useProduct from "@api/useProduct";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

function DeleteBranch({id,state,action}) {
  const {deleteBranch} = useBranch();
  const [modal2Open, setModal2Open] = useState(false);
  const handleDelete = async () => {
    console.log(id);
    const {success,data} = await deleteBranch({id: id})
    if(success) {
        toast.success('Delete branch successfully')
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
        title="Delete branch"
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

export default  DeleteBranch;