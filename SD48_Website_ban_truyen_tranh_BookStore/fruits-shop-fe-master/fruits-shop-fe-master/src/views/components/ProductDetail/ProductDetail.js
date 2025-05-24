import useBranch from "@api/useBranch";
import useProduct from "@api/useProduct";
import StarRating from "@components/Rate/StarRating";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col } from "antd";

import fruitFallback from "../../../assets/img/fruite-item-6.jpg";
import useComment from "@api/useComment";
import { format, parseISO } from "date-fns";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";

import {
  addProductToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../../../../src/services/redux/cartSlice/productSlice.js";

import useUser from "@store/useUser";

import { Link } from "react-router-dom";
import { formatCurrencyVND, getMediaUrl } from "@constants/commonFunctions";

function ProductDetail(id) {

  const formatDateToDDMMYYYY = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (error)
      {
      return "Ngày không hợp lệ";
    }
  };

  const params = useParams();
  const { getById } = useProduct();
  const { getBranch } = useBranch();
  const dispatch = useDispatch();
  const { getCommentByProduct, addComment } = useComment();
  const [productDetail, setProductDetail] = useState({});
  const [branchProduct, setBranch] = useState([]);
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({
    userPost: "",
    email: "",
    comment: "",
  });

  const [count, setCount] = useState(1);
  const userInfo = useUser();

  const fetchData = async (productId) => {
    if (!productId) return;
    const { success, data } = await getById(productId);
    if (data && data.status !== "Error" && success) {
      setProductDetail(data.data);
    } else {
      toast.error(data?.message || "Lỗi tải chi tiết sản phẩm.");
    }
  };

  const fetchDataComments = async (productId) => {
    if (!productId) return;
    const { success, data } = await getCommentByProduct({
      ProductID: productId,
    });
    if (data && data.status !== "Error" && success) {
      setComments(data.data);
    }
  };

  const fetchBranch = async () => {
    const { success, data } = await getBranch({ BranchName: "" });
    if (success && data && data.status !== "Error") {
      setBranch(data.data.items);
    }
  };
  
  const handleAddComment = async () => {
    // ... (implementation kept)
  };


  const handleAddToCart = () => {
    // Bước 1: Hiển thị hộp thoại xác nhận
    const xacNhan = window.confirm(
      `Bạn có chắc chắn muốn thêm "${productDetail.name}" vào giỏ hàng không?`
    ); // Thêm tên sản phẩm vào cho dễ hiểu

    // Bước 2: Kiểm tra xem người dùng có đồng ý không
    if (xacNhan) { // Nếu người dùng nhấn "OK" (xacNhan sẽ là true)
      dispatch(
        addProductToCart({
          id: Number(params.id),
          imgSrc:
            productDetail.images && productDetail.images.length > 0
              ? getMediaUrl(productDetail.images[0]?.imageUrl)
              : fruitFallback,
          name: productDetail.name,
          price: productDetail.discountDTO
            ? productDetail.price -
              (productDetail.discountDTO?.percent
                ? (productDetail.price * productDetail.discountDTO?.percent) / 100
                : productDetail.discountDTO?.moneyDiscount)
            : productDetail.price,
          count: Number(count),
          stock: productDetail.stock,
        })
      );
      toast.success(`${productDetail.name} đã được thêm vào giỏ hàng!`);
    } else {
      // Người dùng nhấn "Cancel" (xacNhan sẽ là false)
      // Bạn có thể làm gì đó ở đây nếu muốn, ví dụ:
      // toast.info("Đã hủy thêm sản phẩm vào giỏ hàng.");
      // Hoặc không làm gì cả cũng được.
    }
  };

  const handleIncrementQuantity = () => {
    dispatch(
      increaseQuantity({
        id: params.id,
        imgSrc: productDetail.images && productDetail.images.length > 0 ? getMediaUrl(productDetail.images[0]?.imageUrl) : fruitFallback,
        name: productDetail.name,
        price: productDetail.price,
        count: count,
      })
    );
  };

  const handleDecrementQuantity = () => {
    dispatch(
      decreaseQuantity({
        id: params.id,
        imgSrc: productDetail.images && productDetail.images.length > 0 ? getMediaUrl(productDetail.images[0]?.imageUrl) : fruitFallback,
        name: productDetail.name,
        price: productDetail.price,
        count: count,
      })
    );
  };

  useEffect(() => {
    if (params.id) {
      fetchData(params.id);
      fetchDataComments(params.id);
      fetchBranch();
    }
    setCount(1);
  }, [params.id]);


  const productPriceDisplay = productDetail.discountDTO
    ? productDetail.price -
      (productDetail.discountDTO.percent
        ? (productDetail.price * productDetail.discountDTO.percent) / 100
        : productDetail.discountDTO.moneyDiscount)
    : productDetail.price;

   const policyItems = [
    { icon: "rocket", title: "Giao hàng nhanh chóng", description: "Từ 03-07 ngày làm việc" },
    { icon: "shield-alt", title: "Sản phẩm chính hãng", description: "Cam kết chất lượng và nguồn gốc rõ ràng." },
    { icon: "credit-card", title: "Thanh toán đa dạng", description: "Hỗ trợ nhiều hình thức thanh toán tiện lợi." },
    { icon: "phone-alt", title: "Hotline hỗ trợ", description: "0909982873 (Tư vấn 8h-21h)" },
  ];

  return (
    <>
      <div className="container-fluid page-header py-5" style={{backgroundColor: '#0d6efd', marginBottom: '3rem'}}>
        <h1 className="text-center text-white display-6">Chi Tiết Sản Phẩm</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to="/" style={{color: '#f8f9fa'}}>Trang Chủ</Link>
          </li>
          <li className="breadcrumb-item active text-white">Chi Tiết Sản Phẩm</li>
        </ol>
      </div>

      <div className="container-fluid">
        <div className="container py-5">
          <div className="row g-5">
            {/* Main Product Info Column */}
            <div className="col-lg-8 col-xl-9">
              <div className="row g-4">
                <div className="col-lg-5 col-xl-5">
                  <div className="border rounded shadow-sm overflow-hidden">
                    <img
                      src={
                        productDetail.images && productDetail.images.length > 0
                          ? getMediaUrl(productDetail.images[0]?.imageUrl)
                          : fruitFallback
                      }
                      className="img-fluid rounded w-100"
                      alt={productDetail.name || "Hình ảnh sản phẩm"}
                      style={{aspectRatio: '1 / 1', objectFit: 'cover'}}
                    />
                  </div>
                </div>  
<div className="col-lg-7 col-xl-7 d-flex flex-column align-items-start">
  {/* Tên sản phẩm */}
  <h2
    className="fw-bold mb-1 text-start"
    style={{ color: '#212529', fontSize: '1.75rem' }}
  >
    {productDetail.name}
  </h2>

  {/* Danh mục nằm ngay dưới tên */}
  <p className="mb-1 text-muted text-start" style={{ fontSize: '0.9rem' }}>
    Thể loại: <span className="text-primary">{productDetail.categoryName || 'Chưa phân loại'}</span>
  </p>

  {/* Giá nằm ngay dưới danh mục */}
  <div className="mb-2 text-start">
    {productDetail.discountDTO ? (
      <>
        <span className="text-muted text-decoration-line-through me-2" style={{ fontSize: '1rem' }}>
          {formatCurrencyVND(productDetail.price)}
        </span>
        <span className="fw-bold text-danger me-2" style={{ fontSize: '1.6rem' }}>
          {formatCurrencyVND(productPriceDisplay)}
        </span>
        {productDetail.discountDTO.percent && (
          <span className="badge bg-danger align-middle" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
            -{productDetail.discountDTO.percent}%
          </span>
        )}
      </>
    ) : (
      <span className="fw-bold text-primary" style={{ fontSize: '1.6rem' }}>
        {formatCurrencyVND(productDetail.price)}
      </span>
    )}
  </div>

  {/* Tác giả, series, ngày phát hành */}
  <div className="mb-2 w-100">
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={12} md={8}>
        <p className="mb-1" style={{ fontSize: '0.9rem', color: '#444' }}>
          <MDBIcon fas icon="user" className="text-primary me-2" />
          <strong>Tác giả:</strong> {productDetail.author || 'N/A'}
        </p>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <p className="mb-1" style={{ fontSize: '0.9rem', color: '#444' }}>
          <MDBIcon fas icon="layer-group" className="text-primary me-2" />
          <strong>Series:</strong> {productDetail.series || 'N/A'}
        </p>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <p className="mb-1" style={{ fontSize: '0.9rem', color: '#444' }}>
          <MDBIcon fas icon="calendar-alt" className="text-primary me-2" />
          <strong>Phát hành:</strong> {productDetail.datePublic ? formatDateToDDMMYYYY(productDetail.datePublic) : 'N/A'}
        </p>
      </Col>
    </Row>
  </div>

  {/* Mô tả sản phẩm */}
  <div className="mb-3 w-100">
    <h6 className="fw-semibold mb-1" style={{ color: '#555', fontSize: '1rem' }}>Mô tả:</h6>
    <p
      className="text-start mb-0"
      style={{ color: '#555', fontSize: '0.95rem', whiteSpace: 'pre-line' }}
    >
      {productDetail.description || 'Sản phẩm chưa có mô tả chi tiết.'}
    </p>
  </div>

  {/* Thông tin thêm */}
  <div className="mb-4 w-100">
    <h6 className="fw-semibold mb-2 text-start" style={{ fontSize: '1rem' }}>Thông tin thêm:</h6>
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={12} md={8}>
        <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.25rem', textAlign: 'left' }}>
          <MDBIcon fas icon="box-open" className="text-primary me-2" />
          <strong>Kho:</strong> {productDetail.stock !== undefined ? `${productDetail.stock} sản phẩm` : 'N/A'}
        </p>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.25rem', textAlign: 'left' }}>
          <MDBIcon fas icon="building" className="text-primary me-2" />
          <strong>Nhà Xuất Bản:</strong> {productDetail.publisher || 'N/A'}
        </p>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.25rem', textAlign: 'left' }}>
          <MDBIcon fas icon="check-circle" className="text-primary me-2" />
          <strong>Chất lượng:</strong> {productDetail.productQuanlity || 'Đảm bảo'}
        </p>
      </Col>
    </Row>
  </div>

  {/* Số lượng và nút Thêm vào giỏ hàng */}
  <div className="d-flex align-items-center w-100" style={{ gap: '1rem' }}>
    <div className="input-group quantity me-3" style={{ width: "120px" }}>
      <div className="input-group-btn">
        <button
          onClick={() => {
            const newCount = count <= 1 ? 1 : count - 1;
            setCount(newCount);
            if (count > 1) handleDecrementQuantity();
          }}
          className="btn btn-sm btn-outline-secondary rounded-circle p-0"
          style={{ width: '32px', height: '32px', lineHeight: '32px', fontSize: '0.8rem' }}
          aria-label="Giảm số lượng"
        >
          <MDBIcon fas icon="minus" />
        </button>
      </div>
      <input
        type="text"
        className="form-control form-control-sm text-center border-0 mx-1 fw-bold"
        value={count}
        readOnly
        style={{ backgroundColor: 'transparent', fontSize: '1.1rem' }}
      />
      <div className="input-group-btn">
        <button
          onClick={() => {
            if (productDetail.stock <= count) {
              toast.warn("Số lượng sản phẩm trong kho không đủ.");
              return;
            }
            setCount(count + 1);
            handleIncrementQuantity();
          }}
          className="btn btn-sm btn-outline-primary rounded-circle p-0"
          style={{ width: '32px', height: '32px', lineHeight: '32px', fontSize: '0.8rem' }}
          aria-label="Tăng số lượng"
        >
          <MDBIcon fas icon="plus" />
        </button>
      </div>
    </div>
    {productDetail.stock > 0 ? (
      <button
        onClick={handleAddToCart}
        className="btn rounded-pill px-4 py-2 d-flex align-items-center shadow-sm text-white"
        style={{ fontSize: '0.95rem', backgroundColor: '#76b852', borderColor: '#76b852' }}
      >
        <MDBIcon fas icon="shopping-cart" className="me-2" /> Thêm vào giỏ hàng
      </button>
    ) : (
      <button
        className="btn btn-secondary rounded-pill px-4 py-2 d-flex align-items-center"
        disabled style={{ fontSize: '0.95rem' }}
      >
        <MDBIcon fas icon="times-circle" className="me-2" /> Hết Hàng
      </button>
    )}
  </div>
</div>

                {/* Removed Tab Navigation and Tab Content for "Thông Tin Chi Tiết" */}
              </div>
            </div>

            {/* Sidebar for Policies */}
            <div className="col-lg-4 col-xl-3">
              <div className="border rounded shadow-sm p-3" style={{backgroundColor: '#f8f9fa'}}>
                {policyItems.map((item, index) => (
                  <div key={index} className={`d-flex align-items-center ${index < policyItems.length - 1 ? 'pb-3 mb-3 border-bottom' : 'pb-2'}`}>
                    <MDBIcon fas icon={item.icon} size="2x" className="text-primary me-3" style={{width: '30px'}} />
                    <div>
                      <h6 className="fw-semibold mb-0" style={{fontSize: '0.95rem', color: '#333'}}>{item.title}</h6>
                      <p className="text-muted mb-0" style={{fontSize: '0.8rem'}}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;