import React from "react";

const FruitsShop = () => {
  return (
    <>
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <div className="tab-class text-center">
            <div className="row g-4">
              <div className="col-lg-4 text-start">
                <h1>Truyện Tranh Đặc Sắc</h1>
              </div>
              <div className="col-lg-8 text-end">
                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill active"
                      data-bs-toggle="pill"
                      href="#tab-1"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Tất Cả Truyện
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex py-2 m-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-2"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Manga
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-3"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Manhwa
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-4"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Manhua
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-5"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Comic Âu Mỹ
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4" id="groupFruit">
                      {/* Nội dung cho "Tất Cả Truyện" sẽ được load động ở đây,
                          hoặc bạn có thể thêm các sản phẩm mẫu tương tự các tab khác */}
                       <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/comic-placeholder-1.jpg" // Thay thế bằng ảnh truyện
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Conan"
                            />
                          </div>
                          <div
                            className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                            style={{ top: 10, left: 10 }}
                          >
                            Manga
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Thám Tử Lừng Danh Conan</h4>
                            <p>
                              Câu chuyện về cậu thám tử học sinh bị teo nhỏ và những vụ án ly kỳ.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                25.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                       <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/comic-placeholder-2.jpg" // Thay thế bằng ảnh truyện
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Solo Leveling"
                            />
                          </div>
                          <div
                            className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                            style={{ top: 10, left: 10 }}
                          >
                            Manhwa
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Solo Leveling</h4>
                            <p>
                              Hành trình trở thành thợ săn mạnh nhất từ một kẻ yếu đuối.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                120.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="tab-2" className="tab-pane fade show p-0">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4">
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/manga-sample-1.jpg" // Ảnh Manga
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện One Piece"
                            />
                          </div>
                          <div
                            className="text-white bg-info px-3 py-1 rounded position-absolute" // Màu khác cho dễ phân biệt
                            style={{ top: 10, left: 10 }}
                          >
                            Manga
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>One Piece</h4>
                            <p>
                              Hành trình của Monkey D. Luffy và băng hải tặc Mũ Rơm.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                22.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/manga-sample-2.jpg" // Ảnh Manga
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Naruto"
                            />
                          </div>
                          <div
                            className="text-white bg-info px-3 py-1 rounded position-absolute"
                            style={{ top: 10, left: 10 }}
                          >
                            Manga
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Naruto</h4>
                            <p>
                              Ước mơ trở thành Hokage của cậu bé ninja Naruto Uzumaki.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                20.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="tab-3" className="tab-pane fade show p-0">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4">
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/manhwa-sample-1.jpg" // Ảnh Manhwa
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Tower of God"
                            />
                          </div>
                          <div
                            className="text-white bg-success px-3 py-1 rounded position-absolute" // Màu khác
                            style={{ top: 10, left: 10 }}
                          >
                            Manhwa
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Tower of God</h4>
                            <p>
                              Chàng trai Bam leo lên tòa tháp bí ẩn để tìm lại người bạn Rachel.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                95.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/manhwa-sample-2.jpg" // Ảnh Manhwa
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện The Breaker"
                            />
                          </div>
                          <div
                            className="text-white bg-success px-3 py-1 rounded position-absolute"
                            style={{ top: 10, left: 10 }}
                          >
                            Manhwa
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>The Breaker</h4>
                            <p>
                              Một học sinh yếu đuối học võ từ một cao thủ Murim.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                89.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="tab-4" className="tab-pane fade show p-0">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4">
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/manhua-sample-1.jpg" // Ảnh Manhua
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Toàn Chức Cao Thủ"
                            />
                          </div>
                          <div
                            className="text-white bg-danger px-3 py-1 rounded position-absolute" // Màu khác
                            style={{ top: 10, left: 10 }}
                          >
                            Manhua
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Toàn Chức Cao Thủ</h4>
                            <p>
                              Diệp Tu, cao thủ game Vinh Quang và con đường trở lại đỉnh cao.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                110.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/manhua-sample-2.jpg" // Ảnh Manhua
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Đấu La Đại Lục"
                            />
                          </div>
                          <div
                            className="text-white bg-danger px-3 py-1 rounded position-absolute"
                            style={{ top: 10, left: 10 }}
                          >
                            Manhua
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Đấu La Đại Lục</h4>
                            <p>
                              Hành trình tu luyện của Đường Tam ở một thế giới huyền huyễn.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                105.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="tab-5" className="tab-pane fade show p-0">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4">
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/comic-sample-1.jpg" // Ảnh Comic
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Batman"
                            />
                          </div>
                          <div
                            className="text-white bg-warning px-3 py-1 rounded position-absolute" // Màu khác
                            style={{ top: 10, left: 10 }}
                          >
                            Comic
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Batman: The Killing Joke</h4>
                            <p>
                              Một trong những câu chuyện đen tối và nổi tiếng nhất về Batman và Joker.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                150.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src="img/comic-sample-2.jpg" // Ảnh Comic
                              className="img-fluid w-100 rounded-top"
                              alt="Bìa truyện Spider-Man"
                            />
                          </div>
                          <div
                            className="text-white bg-warning px-3 py-1 rounded position-absolute"
                            style={{ top: 10, left: 10 }}
                          >
                            Comic
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Spider-Man: Blue</h4>
                            <p>
                              Câu chuyện cảm động về tình yêu đầu của Peter Parker với Gwen Stacy.
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                135.000đ
                              </p>
                              <a
                                href="#"
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                              >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                Thêm vào giỏ
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default FruitsShop;