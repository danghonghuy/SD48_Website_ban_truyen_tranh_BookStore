package com.example.backend_comic_service.develop.model.model;

import lombok.*;

import java.sql.Date;

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
    public Date createdDate;
    public Integer createdBy;
    public Date updatedDate;
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
