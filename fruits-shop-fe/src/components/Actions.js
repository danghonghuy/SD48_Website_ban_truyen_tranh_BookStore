import React from 'react'
import useTranslate from '@lang'
import { isFunction } from '@utils/checkType'

import { Space } from 'antd'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons'

const Actions = ({
	onEdit: emitEdit,
	onDelete: emitDelete
}) => {
	const t = useTranslate()

	const handleEdit = () => {
		if(isFunction(emitEdit)) emitEdit()
	}

	const handleDelete = () => {
		if(isFunction(emitDelete)) emitDelete()
	}

	return (
		<Space>
			<Button
				type='primary'
				size='small'
				icon={<FontAwesomeIcon icon={faPenToSquare} />}
				tooltipPlacement='left'
				tooltipTitle={t('edit')}
				onClick={handleEdit}
			/>
			<Button.Confirm
				type='danger'
				size='small'
				icon={<FontAwesomeIcon icon={faTrashCan} />}
				tooltipPlacement='right'
				tooltipTitle={t('delete')}
				popconfirmTitle={t('delete data')}
				onConfirm={handleDelete}
			/>
		</Space>
	)
}

export default Actions