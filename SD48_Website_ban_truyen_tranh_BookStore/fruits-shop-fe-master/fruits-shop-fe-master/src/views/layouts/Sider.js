import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useSider from '@store/useSider'
import { isArray } from '@utils/checkType'
import { Layout, Menu } from 'antd'
import useRoutes from '@configs/useRoutes.config'

const Sider = ({ items }) => {
	const { collapsed, width, isHide, setCollapsed } = useSider()
	const location = useLocation()
	const navigate = useNavigate()
	const { publicRoutes } = useRoutes()
	const [selectedKey, setSelectedKey] = useState('')

	const filterRole = (routes) => {
		if (isArray(routes)) {
			return routes.map(route => {
				return (
					'children' in route ?
						{ ...route, children: filterRole(route.children) } :
						route
				)
			})
		} else {
			throw new Error('Sider: routes not an array')
		}
	}

	const routes = filterRole(publicRoutes)

	const handleSelect = ({ key }) => {
		setSelectedKey([key])
	}

	const handleClick = ({ item }) => {
		navigate(item.props.path)
	}

	useEffect(() => {
		const { pathname } = location
		setSelectedKey(pathname)
	}, [location])

	return (
		<Layout.Sider
			collapsible
			collapsed={collapsed}
			onCollapse={setCollapsed}
			width={isHide ? 0 : width}
		>
			{/* <Menu
                theme="dark"
                selectedKeys={selectedKey}
                onSelect={handleSelect}
                mode="inline"
                items={routes}
                onClick={handleClick}
            /> */}


			<Menu
				defaultSelectedKeys={['1']}
				defaultOpenKeys={['sub1']}
				mode='inline'
				theme='dark'
				items={routes}
				onClick={handleClick}
			/>
		</Layout.Sider>
	)
}

export default Sider