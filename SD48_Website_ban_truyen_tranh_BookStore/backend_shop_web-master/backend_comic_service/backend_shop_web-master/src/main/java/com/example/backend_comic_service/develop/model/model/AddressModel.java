package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class AddressModel {
    public Integer id;

    public Integer userId;

    public String provinceId;

    public String districtId;

    public String wardId;

    public String addressDetail;

    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    public LocalDateTime createdDate;

    public Integer createdBy;

    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    public LocalDateTime updatedDate;

    public Integer updatedBy;

    public String provinceName;

    public String districtName;

    public String wardName;

    public Integer stage;

    public Integer isDefault;

    public String getFullInfo(){
        if(!this.addressDetail.isEmpty() && this.addressDetail.split("-").length > 1){
            return this.addressDetail;
        }
        return (this.addressDetail.isEmpty() ? "" : this.addressDetail + " - ")
                + (this.wardName == null || this.wardName.isEmpty() ? "" : this.wardName + " - ")
                + (this.districtName == null || this.districtName.isEmpty() ? "" : this.districtName + " - ")
                + (this.provinceName == null || this.provinceName.isEmpty() ? "" : this.provinceName);
    }
}
