import React from "react";
import styled, { keyframes } from "styled-components"; // Import styled và keyframes

// Import font trong file HTML hoặc qua styled-components global style
// Ví dụ global style:
// import { createGlobalStyle } from 'styled-components';
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap');
// `;

import BestSaleProduct from "./components/BestSaleProduct/BestSaleProduct";
import RunningOutProduct from "./components/RunningOutProduct/RunningOutProduct";

// Định nghĩa animation
const fadeInGlow = keyframes`
  0% {
    opacity: 0;
    transform: translateY(25px) scale(0.95);
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.1), 
                 1px 1px 1px rgba(0, 0, 0, 0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    text-shadow: 
      0 0 15px rgba(255, 255, 255, 0.3),
      2px 2px 3px rgba(0, 0, 0, 0.8),
      0 0 30px rgba(255, 220, 150, 0.4);
  }
`;

// Tạo một component H1 đã được style
const StyledHomeTitle = styled.h1`
  font-family: 'Cinzel Decorative', cursive;
  font-weight: 700;
  color: white; 
  text-shadow: 
    0 0 15px rgba(255, 255, 255, 0.3),
    2px 2px 3px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(255, 220, 150, 0.4);
  letter-spacing: 2px;
  line-height: 1.4;
  text-align: center;

  font-size: 2rem; 
  margin-bottom: 0.5rem;

  animation: ${fadeInGlow} 2s ease-out;

  cursor: pointer; 
`;

const Home = () => {
  const handleLogoClick = () => {
    window.location.href = "http://localhost:3000/";
  };

  return (
    <>
      {/* <GlobalStyle /> Nếu dùng global style để import font */}
      <div className="container-fluid page-header py-5">
        <StyledHomeTitle onClick={handleLogoClick}>
          Xin chào đến với cửa hàng Book Store
        </StyledHomeTitle> 
      </div>
      <BestSaleProduct />
      <RunningOutProduct />
    </>
  );
};

export default Home;