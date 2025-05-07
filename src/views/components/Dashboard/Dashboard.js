import React from "react";
import "./assets/css/styles.min.css";
import SidebarDashboard from "../SidebarDashboard/SidebarDashboard";
import SidebarTop from "../SidebarTop/SidebarTop";
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
          <div class="container-fluid" style={{maxWidth: '100%'}}>
            <SastisfyManager />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
