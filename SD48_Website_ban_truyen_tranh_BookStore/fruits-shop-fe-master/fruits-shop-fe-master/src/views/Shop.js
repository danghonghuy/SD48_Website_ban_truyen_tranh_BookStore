import React from "react";
import ShopList from "./components/ShopList/ShopList";
import useMomoCallback from "../hooks/useMomoCallback";

const Shop = () => {
  useMomoCallback();

  // Định nghĩa các style sẽ áp dụng cho thẻ h1
  const titleStyle = {
    // QUAN TRỌNG: Để font tùy chỉnh (ví dụ 'Montserrat') hoạt động,
    // bạn cần nhúng nó vào dự án, thường là trong file public/index.html (xem hướng dẫn ở trên).
    fontFamily: "'Montserrat', Arial, sans-serif", // Sử dụng Montserrat, với fallback là Arial và sans-serif
    
    fontWeight: 600, // Độ đậm semi-bold, vừa phải cho tiêu đề display-6
    // Class 'text-white' của Bootstrap đã đặt màu chữ là trắng.

    letterSpacing: '0.8px', // Tăng nhẹ khoảng cách giữa các chữ cái để thoáng hơn
    
    // Một chút đổ bóng nhẹ nhàng để chữ nổi bật hơn mà không bị "lố".
    // Bóng này hơi lệch xuống và sang phải, mờ nhẹ, giúp dễ đọc trên nhiều nền.
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', 
    
    // Nếu nền của 'page-header' rất tối và đồng nhất, bạn có thể thử hiệu ứng glow trắng nhẹ:
    // textShadow: '0 0 6px rgba(255, 255, 255, 0.25)',

    // Bạn có thể thêm một chút padding bên dưới nếu cần, nhưng display-6 đã có margin nhất định.
    // paddingBottom: '0.25rem', 
  };

  return (
    <>
      <div className="container-fluid page-header py-5"> {/* Sửa class thành className */}
        <h1 
          className="text-center text-white display-6" // Giữ lại các class Bootstrap
          style={titleStyle} // Áp dụng style đã định nghĩa
        >
          Danh sách sản phẩm
        </h1>
      </div>

      <ShopList />
    </>
  );
};

export default Shop;