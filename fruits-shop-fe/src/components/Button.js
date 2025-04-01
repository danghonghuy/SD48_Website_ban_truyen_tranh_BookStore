import React from 'react'
import useTranslate from '@lang'
import useModal from '@utils/hooks/useModal'
import { isFunction } from '../utils/checkType'

import { Button as AntdButton, Tooltip, Popconfirm, Modal as AntdModal } from 'antd'

const Button = ({
	children,
	type = 'primary',
	icon,
	tooltipTitle,
	tooltipPlacement,
	color,
	...props
}) => {
	return (
		<Tooltip
			title={tooltipTitle}
			placement={tooltipPlacement}
		>
			<AntdButton
				type={type}
				icon={icon}
				style={{
					backgroundColor: color,
					borderColor: color
				}}
				{...props}
			>
				{children}
			</AntdButton>
		</Tooltip>
	)
}

const Confirm = ({
	children,
	popconfirmTitle,
	confirmText = 'confirm',
	cancelText =  'close',
	onConfirm: emitConfirm,
	onCancel: emitCancel,
	...props
}) => {
	const t = useTranslate()
	
	return (
		<Popconfirm
			title={popconfirmTitle}
			okText={t(confirmText).toUpperFirst()}
			cancelText={t(cancelText).toUpperFirst()}
			onConfirm={emitConfirm}
			onCancel={emitCancel}
		>
			<Button {...props}>
				{children}
			</Button>
		</Popconfirm>
	)
}

const Modal = ({
	children,
	modalContent,
	modalTitle,
	onConfirm: emitConfirm,
	onCancel: emitCancel,
	...props
}) => {
	const { state, open, close } = useModal()
	
	const handleConfirm = () => {
		isFunction(emitConfirm) && emitConfirm()
		close()
	}

	const handleCancel = () => {
		isFunction(emitCancel) && emitCancel()
		close()
	}

	return (
		<>
			<Button
				onClick={open}
				{...props}
			>
				{children}
			</Button>
			<AntdModal
				title={modalTitle}
				open={state}
				onOk={handleConfirm}
				onCancel={handleCancel}
			>
				{modalContent}
			</AntdModal>
		</>
	)
}

Button.Confirm = Confirm
Button.Modal = Modal

export default Button