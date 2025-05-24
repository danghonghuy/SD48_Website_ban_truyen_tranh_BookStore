import React from 'react';

const PrivacyPolicy = () => {
  const navbarHeight = '100px'; // ƯỚC LƯỢNG CHIỀU CAO NAVBAR CỦA BẠN

  return (
    <div style={{ paddingTop: navbarHeight }}>
      <div className="container py-5">
        <h1 className="mb-4 text-primary">Chính sách Bảo mật</h1>
        <p className="lead mb-4">
          Chào mừng bạn đến với BOOK STORE. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của bạn khi bạn truy cập và sử dụng trang web của chúng tôi.
        </p>

        <section className="mb-5">
          <h2 className="mb-3 h4">1. Thông tin chúng tôi thu thập</h2>
          <p>Chúng tôi có thể thu thập các loại thông tin sau từ bạn:</p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Thông tin cá nhân bạn cung cấp:</strong> Tên, địa chỉ email, số điện thoại, địa chỉ giao hàng khi bạn đăng ký tài khoản, đặt hàng hoặc liên hệ với chúng tôi.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Thông tin giao dịch:</strong> Chi tiết về các sản phẩm bạn đã mua, lịch sử đặt hàng.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành, thông tin về các trang bạn truy cập trên website của chúng tôi, thời gian truy cập và các dữ liệu tương tự.</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">2. Mục đích sử dụng thông tin</h2>
          <p>Thông tin của bạn được sử dụng cho các mục đích sau:</p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Xử lý đơn hàng, giao hàng và cung cấp các sản phẩm/dịch vụ bạn yêu cầu.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Cải thiện trải nghiệm người dùng, cá nhân hóa nội dung và tối ưu hóa trang web.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Gửi thông tin cập nhật về đơn hàng, các chương trình khuyến mãi, bản tin (nếu bạn đồng ý nhận).</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Liên hệ và hỗ trợ khách hàng, giải quyết các thắc mắc hoặc khiếu nại.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Đảm bảo an ninh cho hệ thống của chúng tôi và tuân thủ các nghĩa vụ pháp lý.</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">3. Chia sẻ thông tin</h2>
          <p>Chúng tôi có thể chia sẻ thông tin của bạn với các bên thứ ba trong các trường hợp hạn chế sau:</p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Các đối tác vận chuyển để thực hiện việc giao hàng.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Các đối tác cổng thanh toán để xử lý giao dịch tài chính.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Khi có yêu cầu từ cơ quan pháp luật hoặc để bảo vệ quyền lợi hợp pháp của chúng tôi.</li>
          </ul>
          <p>Chúng tôi cam kết rằng các bên thứ ba này cũng sẽ tuân thủ các quy định bảo mật tương đương hoặc cao hơn.</p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">4. Bảo mật thông tin</h2>
          <p>Chúng tôi áp dụng các biện pháp kỹ thuật, hành chính và vật lý phù hợp để bảo vệ thông tin cá nhân của bạn khỏi mất mát, trộm cắp, truy cập trái phép, sử dụng sai mục đích, thay đổi hoặc phá hủy.</p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">5. Quyền của bạn</h2>
          <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Quyền truy cập và yêu cầu bản sao thông tin cá nhân của bạn mà chúng tôi đang lưu trữ.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Quyền yêu cầu chỉnh sửa hoặc cập nhật thông tin không chính xác.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Quyền yêu cầu xóa thông tin cá nhân của bạn trong một số trường hợp nhất định.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Quyền rút lại sự đồng ý cho việc xử lý dữ liệu (nếu có).</li>
          </ul>
          <p>Vui lòng liên hệ với chúng tôi qua thông tin được cung cấp ở cuối trang để thực hiện các quyền này.</p>
        </section>

        <section>
          <h2 className="mb-3 h4">6. Thay đổi chính sách</h2>
          <p>Chính sách bảo mật này có thể được cập nhật theo thời gian để phản ánh những thay đổi trong thực tiễn hoạt động của chúng tôi hoặc các yêu cầu pháp lý mới. Mọi thay đổi sẽ được thông báo trên trang web này. Chúng tôi khuyến khích bạn thường xuyên xem lại chính sách này.</p>
        </section>

        <p className="mt-5 fst-italic text-muted">
          <em>Xin lưu ý: Đây là nội dung mẫu và cần được điều chỉnh cho phù hợp với hoạt động cụ thể của BOOK STORE. Phiên bản này được cập nhật lần cuối vào [Ngày Hiện Tại].</em>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;