import React, { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleScrollToTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // Thêm event listener khi component mount
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    // Clean up: remove event listener khi component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        zindex: "1000",
        display: isVisible ? "block" : "none",
      }}
      onClick={handleScrollToTopClick}
    >
      <div class="btn btn-primary border-3 border-primary rounded-circle back-to-top">
        <i class="fa fa-arrow-up"></i>
      </div>
    </div>
  );
};

export default ScrollToTopButton;
