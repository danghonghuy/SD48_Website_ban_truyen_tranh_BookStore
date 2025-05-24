package com.example.backend_comic_service.develop.validator;

// import com.example.backend_comic_service.develop.entity.ProductEntity; // Vẫn cần nếu bạn giữ logic kiểm tra trùng code khi cập nhật
import com.example.backend_comic_service.develop.model.request.product.ProductRequest;
import com.example.backend_comic_service.develop.repository.ProductRepository;
// Cân nhắc inject thêm các repository khác nếu muốn validate sự tồn tại của ID ở đây
// import com.example.backend_comic_service.develop.repository.AuthorRepository;
// import com.example.backend_comic_service.develop.repository.PublisherRepository;
// import com.example.backend_comic_service.develop.repository.DistributorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils; // Cho kiểm tra list rỗng
import org.springframework.util.StringUtils;

@Component
public class ProductValidator {

    @Autowired
    private ProductRepository productRepository;

    // @Autowired
    // private AuthorRepository authorRepository; // Bỏ comment nếu muốn validate sự tồn tại của author IDs

    // @Autowired
    // private PublisherRepository publisherRepository; // Bỏ comment nếu muốn validate sự tồn tại của publisher ID

    // @Autowired
    // private DistributorRepository distributorRepository; // Bỏ comment nếu muốn validate sự tồn tại của distributor ID

    public String validate(ProductRequest productRequest) { // Đổi tên tham số cho nhất quán
        StringBuilder errors = new StringBuilder();

        if (productRequest == null) {
            return "Dữ liệu sản phẩm không được để trống."; // Thông báo rõ ràng hơn
        }

        if (!StringUtils.hasText(productRequest.getName())) {
            appendError(errors, "Tên sản phẩm không được để trống.");
        }

        // Kiểm tra code chỉ khi thêm mới và nếu client gửi code (thường code nên được sinh ở backend)
        if (productRequest.getId() == null && !StringUtils.hasText(productRequest.getCode())) {
            // appendError(errors, "Mã sản phẩm không được để trống khi thêm mới."); // Cân nhắc nếu code được sinh tự động
        } else if (StringUtils.hasText(productRequest.getCode())) {
            // Kiểm tra trùng code khi thêm mới hoặc khi sửa mà code thay đổi
            productRepository.findByCode(productRequest.getCode().trim()).ifPresent(existingProduct -> {
                if (productRequest.getId() == null || !existingProduct.getId().equals(productRequest.getId())) {
                    appendError(errors, "Mã sản phẩm '" + productRequest.getCode().trim() + "' đã tồn tại.");
                }
            });
        }


        if (productRequest.getTypeId() == null) {
            appendError(errors, "Loại sản phẩm (type) không hợp lệ."); // Sửa "Gói bán" thành "Loại" cho nhất quán với typeId
        }
        // Việc kiểm tra TypeId có tồn tại trong DB không nên ở Service

        if (productRequest.getCategoryId() == null) {
            appendError(errors, "Thể loại sản phẩm không hợp lệ.");
        }
        // Việc kiểm tra CategoryId có tồn tại trong DB không nên ở Service

        if (productRequest.getPrice() <= 0) { // Sửa điều kiện, giá có thể là 0 nếu là sản phẩm miễn phí? Tùy nghiệp vụ.
            // Nếu giá phải > 0 thì giữ nguyên productRequest.getPrice() == 0
            appendError(errors, "Giá sản phẩm phải lớn hơn 0.");
        }

        if (productRequest.getStock() == null || productRequest.getStock() < 0) { // Cho phép stock = 0
            appendError(errors, "Số lượng sản phẩm không được để trống và không được âm.");
        }

        // VALIDATE CÁC ID MỚI
        // Giả sử Tác giả, NXB, NPH là bắt buộc. Nếu không, hãy bỏ các kiểm tra này hoặc điều chỉnh.

        if (CollectionUtils.isEmpty(productRequest.getAuthorIds())) {
            appendError(errors, "Phải chọn ít nhất một tác giả.");
        }
        // else {
        //     // Tùy chọn: Kiểm tra sự tồn tại của từng authorId trong DB
        //     // for (Integer authorId : productRequest.getAuthorIds()) {
        //     //     if (!authorRepository.existsById(authorId)) {
        //     //         appendError(errors, "ID tác giả '" + authorId + "' không tồn tại.");
        //     //     }
        //     // }
        // }

        if (productRequest.getPublisherId() == null) {
            appendError(errors, "Nhà xuất bản không được để trống.");
        }
        // else {
        //     // Tùy chọn: Kiểm tra sự tồn tại của publisherId trong DB
        //     // if (!publisherRepository.existsById(productRequest.getPublisherId())) {
        //     //     appendError(errors, "ID nhà xuất bản '" + productRequest.getPublisherId() + "' không tồn tại.");
        //     // }
        // }


        if (productRequest.getDistributorId() == null) {
            appendError(errors, "Nhà phát hành không được để trống.");
        }
        // else {
        //     // Tùy chọn: Kiểm tra sự tồn tại của distributorId trong DB
        //     // if (!distributorRepository.existsById(productRequest.getDistributorId())) {
        //     //     appendError(errors, "ID nhà phát hành '" + productRequest.getDistributorId() + "' không tồn tại.");
        //     // }
        // }

        // Logic kiểm tra trùng code khi cập nhật (đã gộp vào phần kiểm tra code ở trên)
        // if(productRequest.getId() != null){
        //     ProductEntity productEntity = productRepository.findByCode(productRequest.getCode()).orElse(null);
        //     if(productEntity != null && !productEntity.getId().equals(productRequest.getId())){
        //         appendError(errors, "Mã sản phẩm đã tồn tại");
        //     }
        // }

        return errors.toString();
    }

    private void appendError(StringBuilder errors, String message) {
        if (errors.length() > 0) {
            errors.append("\n"); // Hoặc một dấu phân cách khác như "; "
        }
        errors.append(message);
    }
}