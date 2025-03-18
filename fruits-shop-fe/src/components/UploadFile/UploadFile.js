import { Button, Modal, Form, Upload, Input } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import classNames from 'classnames/bind'
import Styles from './UploadFile.module.scss'
import useFirmware from '@api/useFirmwares'
import React from 'react'
const cx = classNames.bind(Styles)
const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
}
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
}
  
const UploadFile = ({ID, onchange}) => {
	const [form] = Form.useForm()
	const [fileList, setFileList] = useState([])
	const [name,setName] = useState('')
	const  { uploadFile } = useFirmware()
	
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const showModal = () => {
		setOpen(true)
	}
	const handleOk = async () => {
		const formData = new FormData()
		formData.set('ID', ID)
		formData.set('name',name)
		formData.append('file', fileList[0].originFileObj)
		const {success,data} = await uploadFile(formData)
		if(success) {
			setConfirmLoading(true)
			setTimeout(() => {
				setOpen(false)
				setConfirmLoading(false)
				onchange()
				onReset()
			}, 2000)
		}
	}
	const handleCancel = () => {
		setOpen(false)
	}  
	const onReset = () => {
		form.resetFields()
		setFileList([])
	}
	const handleFileChange = ({fileList}) => {
		setFileList(fileList)
	}
	return (
		<>
			<div className={cx('upload__btn')} onClick={showModal}>
				<Button type='primary' style={{borderRadius: '20px', backgroundColor: 'rgb(39 183 236)'}}>
					<FontAwesomeIcon icon={faUpload} style={{marginRight: '5px'}} />
                        Upload
				</Button>
			</div>
			<Modal
				title='Upload File'
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				okText='Upload'
				className='upload __form'
				okButtonProps={{ style: { backgroundColor: 'rgb(39 183 236)', } }} 
			>
				<Form {...layout} form={form} name='upload-form'>
					<Form.Item name='name' label='File name' rules={[{ required: true }]}>
						<Input onChange={(e) => {
							setName(e.target.value)
						}} />
					</Form.Item>
					<Form.Item name='file' label='File' rules={[{ required: true }]}>
						<Upload
							beforeUpload={() => {
								return false
							}}
							fileList={fileList}
							onChange={handleFileChange}
							maxCount={1}
						>
							<Button icon={<UploadOutlined />}>Select File</Button>
						</Upload>
					</Form.Item>
					<Form.Item {...tailLayout}>
						<Button htmlType='button' onClick={onReset}>
          Reset
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}
export default UploadFile