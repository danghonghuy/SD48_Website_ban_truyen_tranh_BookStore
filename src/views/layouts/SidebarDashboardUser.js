import logdark from '../components/Dashboard/assets/images/logos/dark-logo.svg'
import product from '../components/Dashboard/assets/images/logos/product.png'
import branch from '../components/Dashboard/assets/images/logos/nullability.png'
import dashboard from '../components/Dashboard/assets/images/logos/dashboard.png'
import order from '../components/Dashboard/assets/images/logos/order.png'
import { Link } from "react-router-dom";


const SidebarDashboardUser = () => {
    return (
      <>
        <aside class="left-sidebar">
          <div>
            <div class="brand-logo d-flex align-items-center justify-content-between">
              <a href="./index.html" class="text-nowrap logo-img">
                <img
                  src={logdark}
                  width="180"
                  alt=""
                />
              </a>
              <div
                class="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
                id="sidebarCollapse"
              >
                <i class="ti ti-x fs-8"></i>
              </div>
            </div>
  
            <nav class="sidebar-nav scroll-sidebar" data-simplebar="">
              <ul id="sidebarnav">
                <li class="sidebar-item">
                  <Link to={'/user-profile'} className="sidebar-link" aria-expanded="false" >
                  <span>
                      <img src={dashboard}/>
                    </span>
                    <span class="hide-menu">Thông tin cá nhân</span>
                  </Link>
                </li>
  
                <li class="sidebar-item">
                  <Link to={'/dashboard/history-cart'} className="sidebar-link" aria-expanded="false">
                    <span>
                    <img src={product} />
                      </span>
                      <span class="hide-menu">Đơn hàng</span>
                  </Link>
                </li>           
                   
              </ul>
            </nav>
          </div>
        </aside>
      </>
    );
  };
  
  export default SidebarDashboardUser;
  