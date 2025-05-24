// Ví dụ: src/components/Common/ImageWithFallback.js
// Hoặc đặt ở vị trí phù hợp trong project của bạn

import React, { useState, useEffect } from 'react';

const ImageWithFallback = ({
  src, // Nguồn ảnh gốc
  alt, // Thuộc tính alt cho ảnh
  placeholder, // Nguồn ảnh thay thế khi ảnh gốc lỗi
  style, // Style cho thẻ img
  ...props // Các props khác của thẻ img
}) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder); // Khởi tạo với placeholder để tránh FOUC
  const [imageKey, setImageKey] = useState(Date.now()); // Key để buộc re-render img tag khi src thay đổi

  useEffect(() => {
    // Khi src prop (nguồn ảnh gốc) thay đổi:
    // 1. Nếu có src mới, thử tải src đó.
    // 2. Nếu không có src mới (null/undefined), dùng placeholder.
    // 3. Reset imageKey để React coi đây là một thẻ <img> mới,
    //    điều này quan trọng để kích hoạt lại việc tải ảnh và sự kiện onError nếu src mới cũng lỗi.
    if (src) {
      setCurrentSrc(src);
    } else {
      setCurrentSrc(placeholder);
    }
    setImageKey(Date.now()); // Thay đổi key để reset trạng thái lỗi của thẻ img
  }, [src, placeholder]); // Chạy lại khi src hoặc placeholder thay đổi

  const handleError = () => {
    // Chỉ set về placeholder nếu src hiện tại không phải là placeholder
    // và src gốc (prop) có giá trị (để tránh lặp vô hạn nếu placeholder cũng lỗi)
    if (currentSrc !== placeholder && src) {
      // console.log(`Lỗi tải ảnh: ${currentSrc}, chuyển sang placeholder.`);
      setCurrentSrc(placeholder);
    }
    // Không cần setHasError nữa vì useEffect và imageKey sẽ xử lý việc thử lại
    // khi src prop thay đổi.
    // Việc gán e.target.onerror = null không cần thiết khi dùng key để reset.
  };

  return (
    <img
      key={imageKey} // Sử dụng key để reset component img khi src prop thay đổi
      src={currentSrc}
      alt={alt}
      style={style}
      onError={handleError}
      {...props} // Truyền các props còn lại như className, onClick, v.v.
    />
  );
};

// Giá trị mặc định cho props
ImageWithFallback.defaultProps = {
  placeholder: '/placeholder-image.png', // Đảm bảo file này tồn tại trong thư mục public
  alt: 'Hình ảnh', // Alt text mặc định
};

export default ImageWithFallback;