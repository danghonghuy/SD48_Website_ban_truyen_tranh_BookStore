import React from 'react'
import { Layout } from 'antd'

const Body = ({ children }) => {
	return (

	
		<Layout.Content
			style={{
				flex: 1,
				padding: 10,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'auto',
				justifyContent: 'space-between',
				flexWrap: 'wrap'
			}}
		>
			{children}
		</Layout.Content>
	)
}

export default Body