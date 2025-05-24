package com.example.backend_comic_service.develop.model.base_response;

import com.example.backend_comic_service.develop.constants.CodeResponseEnum; // Import nếu cần
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
// T_ITEM là kiểu của một phần tử trong danh sách (ví dụ: UserModel)
public class BaseListResponseModel<T_ITEM> extends BaseResponseModel<List<T_ITEM>> {
    // BaseResponseModel<List<T_ITEM>> sẽ có các trường:
    // private Integer code;
    // private String message;
    // private boolean success;
    // private List<T_ITEM> data; // Đây là danh sách các item

    private Integer pageIndex;
    private Integer pageSize;
    private Integer totalCount;

    // Không cần khai báo lại các trường code, message, success, data vì đã được kế thừa.

    // Constructor đầy đủ (tùy chọn, nhưng hữu ích)
    public BaseListResponseModel(Integer code, String message, boolean success, List<T_ITEM> data,
                                 Integer totalCount, Integer pageIndex, Integer pageSize) {
        super(code, message, success, data); // Gọi constructor của lớp cha
        this.totalCount = totalCount;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
    }

    // Phương thức tiện ích để thiết lập response thành công cho danh sách
    public void successResponse(List<T_ITEM> listData, int totalCount, String message, int pageIndex, int pageSize) {
        // Gọi hàm của cha để set code, success, data (là listData), message
        super.successResponse(listData, message);
        // Set các trường riêng của BaseListResponseModel
        this.setTotalCount(totalCount);
        this.setPageIndex(pageIndex);
        this.setPageSize(pageSize);
    }

    // Phương thức tiện ích để thiết lập response lỗi cho danh sách
    public void errorResponse(String message, int pageIndex, int pageSize) {
        // Gọi hàm của cha để set code, success=false, message, data=null
        super.errorResponse(message);
        // Set các trường riêng của BaseListResponseModel
        this.setTotalCount(0);
        this.setPageIndex(pageIndex);
        this.setPageSize(pageSize);
        // Đảm bảo data là list rỗng khi lỗi (nếu errorResponse của cha set data=null)
        // super.setData(new ArrayList<>()); // Dòng này có thể không cần nếu errorResponse của cha đã set data = null
        // và khi serialize, null sẽ thành mảng rỗng hoặc null tùy cấu hình Jackson.
        // Để an toàn, nếu muốn luôn là mảng rỗng:
        if (this.getData() == null) { // this.getData() sẽ lấy từ lớp cha
            this.setData(new ArrayList<>()); // this.setData() sẽ set cho lớp cha
        }
    }
}