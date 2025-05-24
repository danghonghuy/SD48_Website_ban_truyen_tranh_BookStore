import React from 'react';

const TermsOfUse = () => {
  const navbarHeight = '100px'; // ƯỚC LƯỢNG CHIỀU CAO NAVBAR CỦA BẠN

  return (
    <div style={{ paddingTop: navbarHeight }}>
      <div className="container py-5">
        <h1 className="mb-4 text-primary">Điều khoản Sử dụng</h1>
        <p className="lead mb-4">
          Chào mừng bạn đến với BOOK STORE. Vui lòng đọc kỹ các Điều khoản Sử dụng ("Điều khoản") này trước khi truy cập hoặc sử dụng trang web ("Trang web") và các dịch vụ ("Dịch vụ") của chúng tôi. Bằng việc truy cập hoặc sử dụng Trang web, bạn đồng ý bị ràng buộc bởi các Điều khoản này.
        </p>

        <section className="mb-5">
          <h2 className="mb-3 h4">1. Chấp nhận Điều khoản</h2>
          <p>Khi sử dụng Trang web này, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ tất cả các điều khoản và điều kiện được quy định tại đây, cũng như Chính sách Bảo mật của chúng tôi. Nếu bạn không đồng ý với bất kỳ phần nào của các Điều khoản này, vui lòng không sử dụng Trang web.</p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">2. Sử dụng Trang web và Dịch vụ</h2>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Bạn đồng ý chỉ sử dụng Trang web và Dịch vụ cho các mục đích hợp pháp, phù hợp với các Điều khoản này và mọi luật lệ, quy định hiện hành.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Bạn không được sử dụng Trang web theo bất kỳ cách nào có thể gây hại, vô hiệu hóa, làm quá tải hoặc làm suy yếu Trang web hoặc can thiệp vào việc sử dụng và tận hưởng Trang web của bất kỳ bên nào khác.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Nghiêm cấm mọi hành vi gian lận, sử dụng thông tin sai lệch, phát tán virus, mã độc, thu thập dữ liệu trái phép hoặc các nội dung gây hại, bất hợp pháp khác.</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">3. Tài khoản người dùng</h2>
          <p>Để truy cập một số tính năng của Trang web, bạn có thể cần tạo một tài khoản. Bạn chịu trách nhiệm:</p>
          <ul className="list-unstyled">
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Bảo mật thông tin đăng nhập (tên người dùng và mật khẩu) của mình.</li>
            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Mọi hoạt động diễn ra dưới tài khoản của bạn.</li>
          </ul>
          <p>Bạn đồng ý thông báo ngay cho chúng tôi về bất kỳ hành vi sử dụng trái phép tài khoản nào hoặc bất kỳ vi phạm bảo mật nào khác.</p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">4. Sở hữu trí tuệ</h2>
          <p>Tất cả nội dung trên Trang web này, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, biểu tượng, hình ảnh, clip âm thanh, video, dữ liệu và phần mềm ("Nội dung"), là tài sản của BOOK STORE hoặc các nhà cung cấp nội dung của chúng tôi và được bảo vệ bởi luật bản quyền, thương hiệu và các luật sở hữu trí tuệ khác. Bạn không được sao chép, sửa đổi, phân phối, truyền tải, hiển thị, tái bản, bán, cấp phép hoặc tạo ra các tác phẩm phái sinh từ bất kỳ Nội dung nào mà không có sự cho phép trước bằng văn bản của chúng tôi.</p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 h4">5. Giới hạn trách nhiệm</h2>
          <p>Trang web và Dịch vụ được cung cấp "nguyên trạng" và "như sẵn có" mà không có bất kỳ sự đảm bảo nào, dù rõ ràng hay ngụ ý. Chúng tôi không đảm bảo rằng Trang web sẽ hoạt động không bị gián đoạn, không có lỗi, an toàn hoặc không có virus. Trong phạm vi tối đa được pháp luật cho phép, BOOK STORE từ chối mọi trách nhiệm pháp lý đối với bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt, Folge hoặc trừng phạt nào phát sinh từ hoặc liên quan đến việc bạn sử dụng hoặc không thể sử dụng Trang web hoặc Dịch vụ.</p>
        </section>

        <section>
          <h2 className="mb-3 h4">6. Thay đổi Điều khoản</h2>
          <p>Chúng tôi có quyền sửa đổi các Điều khoản Sử dụng này vào bất kỳ lúc nào theo quyết định riêng của mình. Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải lên Trang web. Việc bạn tiếp tục sử dụng Trang web sau khi các thay đổi đó được đăng có nghĩa là bạn chấp nhận các điều khoản đã sửa đổi. Chúng tôi khuyến khích bạn xem lại các Điều khoản này định kỳ.</p>
        </section>

        <p className="mt-5 fst-italic text-muted">
          <em>Xin lưu ý: Đây là nội dung mẫu và cần được điều chỉnh cho phù hợp với hoạt động cụ thể của BOOK STORE. Phiên bản này được cập nhật lần cuối vào [Ngày Hiện Tại].</em>
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;