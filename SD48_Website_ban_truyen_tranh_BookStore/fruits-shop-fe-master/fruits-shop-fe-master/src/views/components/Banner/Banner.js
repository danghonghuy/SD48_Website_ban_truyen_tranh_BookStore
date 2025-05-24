import React from "react";

const Banner = () => {
  return (
    <>
      <div className="container-fluid banner bg-secondary my-5">
        <div className="container py-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="py-4">
                <h1 className="display-3 text-white">Thế Giới Truyện Tranh</h1>
                <p className="fw-normal display-3 text-dark mb-4">
                  Đầy Hấp Dẫn
                </p>
                <p className="mb-4 text-dark">
                  Khám phá hàng ngàn đầu truyện tranh từ kinh điển đến mới nhất, đa dạng thể loại, luôn được cập nhật thường xuyên.
                </p>
                <a
                  href="#"
                  className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5"
                >
                  KHÁM PHÁ NGAY
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Bạn nhớ thay thế src bằng hình ảnh banner truyện tranh phù hợp */}
                <img
                  src="img/comic-banner-placeholder.png" // Đề xuất thay đổi tên file ảnh
                  className="img-fluid w-100 rounded"
                  alt="Banner truyện tranh"
                />
                {/* Phần hiển thị giá theo kg này có thể không phù hợp với truyện tranh, bạn có thể cân nhắc bỏ đi hoặc thay bằng thông tin khác (ví dụ: "Mới nhất", "Bán chạy",...) */}
                {/*
                <div
                  className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute"
                  style={{ width: 140, height: 140, top: 0, left: 0 }}
                >
                  <h1 style={{ fontSize: 100 }}>1</h1>
                  <div className="d-flex flex-column">
                    <span className="h2 mb-0">50$</span>
                    <span className="h4 text-muted mb-0">kg</span>
                  </div>
                </div>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;