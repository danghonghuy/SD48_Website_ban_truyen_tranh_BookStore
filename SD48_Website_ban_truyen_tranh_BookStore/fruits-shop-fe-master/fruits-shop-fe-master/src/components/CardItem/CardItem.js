import React from "react";
import { useDispatch } from "react-redux";
import { addProductToCart } from "../../services/redux/cartSlice/productSlice";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@constants/commonFunctions";
import { toast } from "react-toastify";

const CardItem = ({
  id,
  imgSrc,
  name,
  description,
  price, // Giá gốc
  discount, // Số tiền được giảm
  stock,
}) => {
  const dispatch = useDispatch();

  function formatCurrencyVND(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return "N/A"; // Hoặc một giá trị mặc định khác
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (stock > 0) {
      dispatch(
        addProductToCart({
          id,
          imgSrc,
          name,
          description,
          price: discount && discount > 0 ? price - discount : price, // Giá cuối cùng sau khi giảm
          count: 1,
          stock,
        })
      );
      toast.success(`Đã thêm "${name}" vào giỏ hàng!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const originalPrice = price;
  const amountSaved = discount && discount > 0 ? discount : 0;
  const finalPrice = originalPrice - amountSaved;
  const hasDiscount = amountSaved > 0;
  const discountPercentage = hasDiscount ? Math.round((amountSaved / originalPrice) * 100) : 0;

  const styles = `
    .card-item-scope {
      --primary-green: #28a745; /* Bootstrap success green - có thể đổi màu khác */
      --primary-green-dark: #1e7e34;
      --primary-green-light: #d4edda;
      --text-dark: #212529;
      --text-muted: #6c757d;
      --border-color: #e0e0e0;
      --card-bg: #ffffff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Font stack tốt hơn */
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card-item-link-custom {
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .product-card-custom {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px; /* Bo góc mềm mại hơn */
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .product-card-custom:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
    }

    .product-image-wrapper {
      width: 100%;
      padding-top: 75%; /* Tỷ lệ 4:3, có thể điều chỉnh (ví dụ 100% cho 1:1) */
      position: relative;
      overflow: hidden;
      background-color: #f8f9fa;
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover; /* 'cover' để lấp đầy, 'contain' để hiển thị toàn bộ */
      transition: transform 0.35s ease-in-out;
    }

    .product-card-custom:hover .product-image {
      transform: scale(1.08);
    }

    .discount-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background-color: var(--primary-green);
      color: white;
      padding: 5px 10px;
      font-size: 0.75rem;
      font-weight: bold;
      border-radius: 5px;
      z-index: 1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .out-of-stock-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-15deg);
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 8px 15px;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 5px;
      z-index: 2;
      text-transform: uppercase;
    }


    .card-content-area {
      padding: 1rem 1.25rem 1.25rem; /* Top, L/R, Bottom */
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .product-name-display {
      font-size: 1.15rem; /* Tăng nhẹ kích thước */
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.6rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: calc(1.15rem * 1.4 * 2); /* Chừa không gian cho 2 dòng */
    }

    .price-info-area {
      margin-bottom: 1rem;
      min-height: 40px; /* Đảm bảo không gian cho giá, tránh nhảy layout */
      display: flex;
      flex-direction: column;
      align-items: flex-start; /* Căn trái các dòng giá */
    }
    
    .price-line {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap; /* Cho phép wrap nếu không đủ chỗ */
        width: 100%;
    }
    
    .original-price-display {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-decoration: line-through;
      margin-right: 0.5rem;
    }

    .final-price-display {
      font-size: 1.3rem; /* Làm nổi bật giá cuối */
      font-weight: 700;
      color: var(--primary-green);
    }
    
    .savings-info {
      font-size: 0.8rem;
      color: var(--primary-green);
      font-weight: 500;
      margin-top: 0.25rem; /* Khoảng cách nhỏ phía trên nếu có giá gốc */
    }


    .action-button-wrapper {
      margin-top: auto; /* Đẩy nút xuống dưới */
    }

    .add-to-cart-button, .out-of-stock-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 2rem; /* Bo tròn nhiều */
      cursor: pointer;
      transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.1s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .add-to-cart-button {
      border: 2px solid var(--primary-green);
      background-color: var(--primary-green);
      color: white;
    }

    .add-to-cart-button:hover {
      background-color: var(--primary-green-dark);
      border-color: var(--primary-green-dark);
      transform: scale(1.02);
    }
    
    .add-to-cart-button .fa-shopping-bag {
      margin-right: 0.6rem;
      font-size: 1rem;
    }

    .out-of-stock-button {
      border: 2px solid #adb5bd;
      background-color: #e9ecef;
      color: var(--text-muted);
      cursor: not-allowed;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="col-md-6 col-lg-6 col-xl-3 mb-4 card-item-scope">
        <Link to={`/product/${id}`} className="card-item-link-custom">
          <div className="product-card-custom">
            <div className="product-image-wrapper">
            {hasDiscount && (
  <span className="discount-badge">
    Giảm {discountPercentage > 0 ? `${discountPercentage}%` : formatCurrencyVND(amountSaved)}
  </span>
)}
              {stock <= 0 && (
                <span className="out-of-stock-badge">Hết hàng</span>
              )}
              <img
                className="product-image"
                src={getMediaUrl(imgSrc) || "https://via.placeholder.com/300x225?text=Ảnh+Truyện"}
                alt={name}
              />
            </div>
            <div className="card-content-area">
              <div> {/* Wrapper for name and price */}
                <h4 className="product-name-display" title={name}>{name}</h4>
                <div className="price-info-area">
                  {hasDiscount ? (
                    <>
                      <div className="price-line">
                        <p className="original-price-display mb-0">
                          {formatCurrencyVND(originalPrice)}
                        </p>
                        <p className="final-price-display mb-0">
                          {formatCurrencyVND(finalPrice)}
                        </p>
                      </div>
                      {/* <p className="savings-info mb-0">
                        Tiết kiệm: {formatCurrencyVND(amountSaved)}
                      </p> */}
                    </>
                  ) : (
                    <p className="final-price-display mb-0">
                      {formatCurrencyVND(originalPrice)}
                    </p>
                  )}
                </div>
              </div>

              <div className="action-button-wrapper">
                {stock > 0 ? (
                  <button
                    type="button"
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                  >
                    <i className="fa fa-shopping-bag"></i> Thêm vào giỏ
                  </button>
                ) : (
                  <div className="out-of-stock-button">
                    Hết hàng
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default CardItem;