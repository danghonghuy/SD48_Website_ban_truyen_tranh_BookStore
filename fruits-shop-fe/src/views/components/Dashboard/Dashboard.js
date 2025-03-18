import React from "react";
import "./assets/css/styles.min.css";
import SidebarDashboard from "../SidebarDashboard/SidebarDashboard";
import SidebarTop from "../SidebarTop/SidebarTop";
import SaleOverview from "../SaleOverview/SaleOverview";
import RecentTransactionsLeft from "../RecentTransactionsLeft/RecentTransactionsLeft";
import RecentTransactionsRight from "../RecentTransactionsRight/RecentTransactionsRight";
import TableDataDashboard from "../TableDataDashboard/TableDataDashboard";
import SastisfyManager from "./SastisfyManager/SastisfyManager";

const Dashboard = () => {
  return (
    <>
      <div
        class="page-wrapper"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
      >
        <SidebarDashboard />
        <div class="body-wrapper">
          <SidebarTop />
          <div class="container-fluid">
            <SastisfyManager />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
