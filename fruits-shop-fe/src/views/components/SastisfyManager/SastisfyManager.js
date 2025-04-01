
import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Progress,
  Upload,
  message,
  Button,
  Timeline,
  Radio,
} from "antd";
import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";

function SastisfyManager() {
   return ( 
    <div className='row'>
      <div className='mt-6 col-xl-3 col-lg-6 col-md-12 col-12'>
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div><h4 class="mb-0">Doanh số</h4>
                </div>
                <div class="icon-shape icon-md bg-light-primary text-primary rounded-2">
                  <img width="25" height="25" src="https://img.icons8.com/dusk/64/product.png" alt="product"/>
                  </div>
                  </div>
                  <div>
                    
                    <h1 class="fw-bold">
                      {/* {dataDashboard.dataCountOrigins} */}
                      {formatCurrencyVND(dataDashboard.totalByYear)}
                    </h1>
                    {/* <p class="mb-0">
                    Prestige</p> */}
                    </div>
                    </div>
                  </div>
                <div>
            </div>

        </div>
    <div className='mt-6 col-xl-3 col-lg-6 col-md-12 col-12'>
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div><h4 class="mb-0">Danh mục  </h4>
                  </div>
                  <div class="icon-shape icon-md bg-light-primary text-primary rounded-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"></path></svg></div></div><div><h1 class="fw-bold">
                      {dataDashboard.dataCountBranchs}
                      </h1>
                      
                      
                      {/* <p class="mb-0">
                      Completed</p> */}
                      </div>
                      </div>
                      </div>
                  <div>
              </div>




              

          </div>
        <div className='mt-6 col-xl-3 col-lg-6 col-md-12 col-12'>
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div><h4 class="mb-0">Số sản phẩm</h4>
                </div>
                <div class="icon-shape icon-md bg-light-primary text-primary rounded-2">
                  <img width="25" height="25" src="https://img.icons8.com/dusk/64/product.png" alt="product"/>
                  </div>
                  </div>
                  <div>
                    
                    <h1 class="fw-bold">
                      {/* {dataDashboard.dataCountOrigins} */}
                      {/* {formatCurrencyVND(dataDashboard.totalByYear)} */}
                       {dataDashboard.dataProduct}

                    </h1>
                    {/* <p class="mb-0">
                    Prestige</p> */}
                    </div>
                    </div>
                  </div>
                <div>
            </div>

        </div>


        {/* THEM THUONG HIEU */}
        

        {/*  */}


        <div className='mt-6 col-xl-3 col-lg-6 col-md-12 col-12'>
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div><h4 class="mb-0">Sản phẩm đã bán</h4>
                </div>
                <div class="icon-shape icon-md bg-light-primary text-primary rounded-2">
                  <img width="25" height="25" src="https://img.icons8.com/dusk/64/product.png" alt="product"/>
                  </div>
                  </div>
                  <div>
                    
                    <h1 class="fw-bold">
                      {/* {dataDashboard.dataProduct} */}
     

                      {dataDashboard.countProductSold}
                    </h1>
                    {/* <p class="mb-0">
                    Fresh</p> */}
                    </div>
                    </div>
                  </div>
                <div>
            </div>

        </div>


        <div className='mt-6 col-xl-12 col-lg-6 col-md-12 col-12'>
        </div>
        <div className='mt-6 col-xl-4 col-lg-6 col-md-12 col-12'>
          <span style={{fontSize:"16px", color:"black", fontWeight:"600"}}>
            Số lượng sản phẩm theo Danh mục
          </span>
          <Pie style={{fontSize:"16px", color:"black", fontWeight:"600"}} data={data} />
        </div>

        <div className='mt-6 col-xl-6 col-lg-6 col-md-12 col-12'>
          <span style={{fontSize:"16px", color:"black", fontWeight:"600"}}>
            Tỉ lệ trạng thái đơn hàng
          </span>


          <td class="align-middle text-dark">
            
            <div class="float-start me-3" style={{fontSize:"16px", color:"black", fontWeight:"600"}}>Thành công    <br></br>{(dataDashboard.orderSuccess * 100).toFixed(2)}%</div>
            <div class="mt-2">
              <div style={{height: '5px'}} cx={"progress"}>
                <div role="progressbar" className={cx("progress-bar")} style={{width: `${(dataDashboard.orderSuccess * 100).toFixed(2)}%`}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>
              </div>
          </td>
          {/* <td class="align-middle text-dark"><div class="float-start me-3" style={{marginLeft:"30px",fontSize:"16px", color:"black", fontWeight:"600"}} >Đã hủy    <br></br>{(dataDashboard.orderCancle * 100).toFixed(2)}%</div><div class="mt-2"><div style={{height: '5px'}} className={cx("progress")}><div role="progressbar" cx={"progress-bar"} style={{width: '35%'}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"></div></div></div></td> */}
          <td class="align-middle text-dark" ><div class="float-start me-3" style={{marginLeft:"30px",fontSize:"16px", color:"black", fontWeight:"600"}}>Thất bại    <br></br>{(dataDashboard.orderFailed * 100).toFixed(2)}%</div><div class="mt-2"><div style={{height: '5px'}} className={cx("progress")}><div role="progressbar" cx={"progress-bar" }style={{width: '35%'}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"></div></div></div></td>
        </div>
    </div>
 );
}

export default SastisfyManager;