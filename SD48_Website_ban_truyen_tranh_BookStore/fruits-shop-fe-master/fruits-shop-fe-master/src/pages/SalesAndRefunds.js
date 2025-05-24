import React from 'react';

const SalesAndRefunds = () => {
  const navbarHeight = '100px'; // ƯỚC LƯỢNG CHIỀU CAO NAVBAR CỦA BẠN

  return (
    <div style={{ paddingTop: navbarHeight }}>
      <div className="container py-5">
        <h1 className="mb-4 text-primary">Chính sách Bán hàng, Đổi Trả & Hoàn tiền</h1>
        <p className="lead mb-4">
          Cảm ơn bạn đã mua sắm tại BOOK STORE. Chúng tôi luôn mong muốn mang đến cho bạn trải nghiệm mua sắm hài lòng nhất. Dưới đây là các chính sách liên quan đến việc mua hàng, đổi trả và hoàn tiền sản phẩm.
        </p>

        <section className="mb-5">
          <h2 className="mb-3 h4">1. Đặt hàng và Thanh toán</h2>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Xác nhận đơn hàng:</strong> Sau khi bạn đặt hàng, chúng tôi sẽ gửi email xác nhận thông tin chi tiết đơn hàng.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Hình thức thanh toán:</strong> Chúng tôi chấp nhận các hình thức thanh toán phổ biến như thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, thanh toán qua ví điện tử, thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB...).</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Giá sản phẩm:</strong> Giá sản phẩm được niêm yết trên trang web là giá cuối cùng (đã bao gồm VAT nếu có) tại thời điểm đặt hàng, chưa bao gồm phí vận chuyển (nếu có).</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">2. Vận chuyển và Giao nhận</h2>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Phạm vi giao hàng:</strong> Chúng tôi giao hàng trên toàn quốc.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Thời gian giao hàng:</strong> Thời gian giao hàng dự kiến từ 2-5 ngày làm việc tùy thuộc vào địa chỉ nhận hàng và điều kiện vận chuyển. Thời gian cụ thể sẽ được thông báo trong quá trình đặt hàng.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Phí vận chuyển:</strong> Phí vận chuyển sẽ được tính dựa trên trọng lượng đơn hàng, địa chỉ giao hàng và chính sách của đối tác vận chuyển. Thông tin phí sẽ hiển thị rõ ràng trước khi bạn hoàn tất đơn hàng.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Kiểm tra hàng hóa:</strong> Vui lòng kiểm tra kỹ sách khi nhận hàng. Nếu phát hiện sách bị hư hỏng (rách, nhàu, ẩm mốc), sai tựa sách, sai phiên bản, hoặc thiếu sách, vui lòng từ chối nhận hàng và/hoặc thông báo ngay cho chúng tôi trong vòng 24 giờ.</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">3. Chính sách Đổi/Trả hàng</h2>
          <p>Chúng tôi hỗ trợ đổi/trả sản phẩm trong các trường hợp sau:</p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Sách bị lỗi in ấn (thiếu trang, trang bị ngược, chữ mờ,...) do nhà xuất bản.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Sách bị hư hỏng trong quá trình vận chuyển (rách, nhàu, cong vênh, ẩm ướt).</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Giao sai tựa sách, sai tác giả, sai phiên bản (bìa cứng/bìa mềm, tái bản lần thứ mấy...) so với đơn đặt hàng.</li>
            {/* Cân nhắc thêm: <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Sản phẩm hết hạn sử dụng trước hoặc vào ngày sản phẩm được giao cho khách hàng. (Ít áp dụng cho sách, trừ khi là lịch, ấn phẩm định kỳ)</li> */}
          </ul>
          <p><strong>Điều kiện đổi/trả:</strong></p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-angle-right text-info me-2"></i>Sách còn nguyên vẹn, không bị cong vênh, nhàu nát, dính bẩn, viết vẽ, gấp trang, hoặc có dấu hiệu đã qua sử dụng rõ rệt (trừ trường hợp lỗi do vận chuyển hoặc nhà sản xuất).</li>
            <li className="mb-2"><i className="fas fa-angle-right text-info me-2"></i>Còn đầy đủ bao bì gốc (nếu có, ví dụ: bọc seal, hộp đựng sách), bookmark hoặc quà tặng kèm (nếu có) và hóa đơn mua hàng/biên nhận.</li>
            <li className="mb-2"><i className="fas fa-angle-right text-info me-2"></i>Thời gian yêu cầu đổi/trả trong vòng [ví dụ: 7 ngày] kể từ ngày nhận hàng. </li>
          </ul>
          <p><em>Lưu ý:
            <ul>
              <li>Sách điện tử (ebooks, audiobooks) sau khi đã được tải về hoặc kích hoạt thường không được áp dụng chính sách đổi/trả, trừ trường hợp lỗi kỹ thuật từ phía chúng tôi.</li>
              <li>Các sản phẩm trong chương trình khuyến mãi đặc biệt, thanh lý có thể có chính sách đổi/trả riêng hoặc không áp dụng đổi/trả. Vui lòng kiểm tra kỹ thông tin sản phẩm và chương trình.</li>
            </ul>
          </em></p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">4. Quy trình Hoàn tiền</h2>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Sau khi chúng tôi nhận được sách trả lại và xác nhận sách đủ điều kiện đổi/trả, chúng tôi sẽ tiến hành hoàn tiền cho bạn.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Thời gian hoàn tiền có thể từ [ví dụ: 3-7 ngày làm việc] kể từ ngày chúng tôi xác nhận yêu cầu, tùy thuộc vào phương thức thanh toán ban đầu của bạn và quy trình làm việc của ngân hàng/đối tác thanh toán. </li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Tiền hoàn sẽ được chuyển vào tài khoản ngân hàng, ví điện tử hoặc thẻ bạn đã sử dụng để thanh toán. Đối với đơn hàng COD, chúng tôi có thể yêu cầu thông tin tài khoản ngân hàng để hoàn tiền.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 h4">5. Liên hệ Hỗ trợ</h2>
          <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bán hàng, đổi trả và hoàn tiền, hoặc cần hỗ trợ về đơn hàng, vui lòng liên hệ với bộ phận chăm sóc khách hàng của BOOK STORE qua:</p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-envelope text-info me-2"></i>Email: huydhph45901@fpt.edu.vn</li>
            <li className="mb-2"><i className="fas fa-phone text-info me-2"></i>Điện thoại: 0337233555 (Giờ làm việc)</li>
            {/* <li className="mb-2"><i className="fas fa-comment-dots text-info me-2"></i>Live chat trên website (nếu có)</li> */}
          </ul>
        </section>

        <p className="mt-5 fst-italic text-muted">
          <em>Xin lưu ý: Đây là nội dung mẫu và cần được điều chỉnh cho phù hợp với hoạt động cụ thể của BOOK STORE. Phiên bản này được cập nhật lần cuối vào [<strong>19/05/2025</strong>].</em>
        </p>
      </div>
    
    </div>
  );
};

export default SalesAndRefunds;