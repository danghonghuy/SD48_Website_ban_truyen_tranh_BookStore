import React, { useState } from 'react'
import useTranslate from '@lang'
import { isFunction } from '@utils/checkType'

import { Row, Col, Space, Button, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownAZ, faArrowUpAZ } from '@fortawesome/free-solid-svg-icons'

const { Search } = Input

const Filter = ({
	onSort,
	onSearch,
	onReset
}) => {
	const t = useTranslate()
	const [search, setSearch] = useState('')

	const emitSoft = val => isFunction(onSort) && onSort(val)

	const handleSoftDown = () => emitSoft(-1)

	const handleSoftUp = () => emitSoft(1)

	const emitSearch = () => isFunction(onSearch) && onSearch(search)

	const emitReset = () => {
		setSearch('')
		isFunction(onReset) && onReset()
	}

	const handleChangeSearch = (e) => setSearch(e.target.value)

	return (
		<Row
			gutter={[10, 10]}
			style={{ padding: 10 }}
		>
			<Col span={24}>
				<Space>
					<Button
						icon={<FontAwesomeIcon icon={faArrowDownAZ} />}
						onClick={handleSoftDown}
					/>
					<Button
						icon={<FontAwesomeIcon icon={faArrowUpAZ} />}
						onClick={handleSoftUp}
					/>
				</Space>
			</Col>
			<Col span={24}>
				<Search
					placeholder={t('search')}
					value={search}
					onChange={handleChangeSearch}
					onSearch={emitSearch}
				/>
			</Col>
			<Col span={24}>
				<Row justify='end'>
					<Col>
						<Button
							type='primary'
							size='small'
							onClick={emitReset}
						>
							{t('reset').toUpperFirst()}
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}

export default Filter