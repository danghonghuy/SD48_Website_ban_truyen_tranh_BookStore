import React from "react";

const Contact = () => {
  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Liên Hệ</h1>
   
      </div>

      <div className="container-fluid contact py-5">
        <div className="container py-5">
          <div className="p-5 bg-light rounded">
            <div className="row g-4">
              <div className="col-12">
                <div
                  className="text-center mx-auto"
                  style={{ maxWidth: "700px" }}
                >
                  <h1 className="text-primary">Liên lạc với chúng tôi</h1>
                  <p className="mb-4">
                    Biểu mẫu liên hệ hiện không hoạt động. Để có biểu mẫu liên hệ hoạt động với Ajax & PHP trong vài phút, chỉ cần sao chép và dán các tệp, thêm một chút mã là bạn đã hoàn tất.{" "}
                    <a href="https://htmlcodex.com/contact-form">
                      Tải xuống ngay
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="h-100 rounded">
                  <iframe
                    className="rounded w-100"
                    style={{ height: "400px" }}
                    // Cân nhắc thay thế bằng bản đồ địa chỉ của bạn ở Việt Nam
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.636979990203!2d105.78077297500026!3d21.007176080635403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aca00c116423%3A0x8a7f9d0308689450!2zS2FuZyBOYW0gSOGDoCBO4buZaSBMYW5kbWFyayBUb3dlciwgUGjGsOG7nW5nIE3hu4UgVHLDrCwgTmFtIFThu6cgTGnDqm0sIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1699950841202!5m2!1svi!2s"
                    loading="lazy"
                    title="Bản đồ vị trí"
                  ></iframe>
                </div>
              </div>
              <div className="col-lg-7">
                <form action="" className="">
                  <input
                    type="text"
                    className="w-100 form-control border-0 py-3 mb-4"
                    placeholder="Tên của bạn"
                  />
                  <input
                    type="email"
                    className="w-100 form-control border-0 py-3 mb-4"
                    placeholder="Nhập Email của bạn"
                  />
                  <textarea
                    className="w-100 form-control border-0 mb-4"
                    rows="5"
                    cols="10"
                    placeholder="Lời nhắn của bạn"
                  ></textarea>
                  <button
                    className="w-100 btn form-control border-secondary py-3 bg-white text-primary "
                    type="submit"
                  >
                    Gửi
                  </button>
                </form>
              </div>
              <div className="col-lg-5">
                <div className="d-flex p-4 rounded mb-4 bg-white">
                  <i className="fas fa-map-marker-alt fa-2x text-primary me-4"></i>
                  <div>
                    <h4>Địa chỉ</h4>
                    <p className="mb-2">123 Đường Sách, Quận Truyện, TP.HCM</p>
                  </div>
                </div>
                <div className="d-flex p-4 rounded mb-4 bg-white">
                  <i className="fas fa-envelope fa-2x text-primary me-4"></i>
                  <div>
                    <h4>Email</h4>
                    <p className="mb-2">lienhe@truyenhay.com</p>
                  </div>
                </div>
                <div className="d-flex p-4 rounded bg-white">
                  <i className="fa fa-phone-alt fa-2x text-primary me-4"></i>
                  <div>
                    <h4>Điện thoại</h4>
                    <p className="mb-2">(+84) 123 456 789</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;