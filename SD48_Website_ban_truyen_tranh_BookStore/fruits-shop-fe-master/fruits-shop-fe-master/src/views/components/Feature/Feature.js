import React from "react";

const Feature = () => {
  return (
    <div className="container-fluid featurs py-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="featurs-item text-center rounded bg-light p-4">
              <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                <i className="fas fa-car-side fa-3x text-white"></i>
              </div>
              <div className="featurs-content text-center">
                <h5>Miễn Phí Vận Chuyển</h5>
                <p className="mb-0">Miễn phí cho đơn hàng trên 7.000.000đ</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="featurs-item text-center rounded bg-light p-4">
              <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                <i className="fas fa-user-shield fa-3x text-white"></i>
              </div>
              <div className="featurs-content text-center">
                <h5>Thanh Toán An Toàn</h5>
                <p className="mb-0">Thanh toán an toàn 100%</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="featurs-item text-center rounded bg-light p-4">
              <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                <i className="fas fa-exchange-alt fa-3x text-white"></i>
              </div>
              <div className="featurs-content text-center">
                <h5>Đổi Trả Trong 30 Ngày</h5>
                <p className="mb-0">Đảm bảo hoàn tiền trong 30 ngày</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="featurs-item text-center rounded bg-light p-4">
              <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                <i className="fa fa-phone-alt fa-3x text-white"></i>
              </div>
              <div className="featurs-content text-center">
                <h5>Hỗ Trợ 24/7</h5>
                <p className="mb-0">Hỗ trợ nhanh chóng mọi lúc</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;