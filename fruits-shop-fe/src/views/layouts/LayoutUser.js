import React from 'react'
import { Layout as AntdLayout } from 'antd'
import Body from './Body'
import SidebarDashboard from '@views/components/SidebarDashboard/SidebarDashboard'
import SidebarTop from '@views/components/SidebarTop/SidebarTop'
import SidebarDashboardUser from './SidebarDashboardUser'

const LayoutUser = ({ children }) => {
	return (
		<div
        class="page-wrapper"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      >
        <SidebarDashboardUser/>
        <div class="body-wrapper">
          <SidebarTop />
          <div class="container-fluid">
		  <Body>
                {children}
        </Body>
          </div>
        </div>
      </div>
	)
}

export default LayoutUser