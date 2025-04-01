package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.dto.ShippingFeeDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shipping_fee")
public class ShippingFee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_id")
    private Long feeId;

    @Column(name = "point_source")
    private String pointSource;


    @Column(name = "point_destination")
    private String pointDestination;

    @Column(name = "fee")
    private Double fee;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "status")
    private StatusFeeEnum status;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "updated_by")
    private String updatedBy;

    public Long getFeeId() {
        return feeId;
    }

    public void setFeeId(Long feeId) {
        this.feeId = feeId;
    }

    public String getPointSource() {
        return pointSource;
    }

    public void setPointSource(String pointSource) {
        this.pointSource = pointSource;
    }

    public String getPointDestination() {
        return pointDestination;
    }

    public void setPointDestination(String pointDestination) {
        this.pointDestination = pointDestination;
    }

    public Double getFee() {
        return fee;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public StatusFeeEnum getStatus() {
        return status;
    }

    public void setStatus(StatusFeeEnum status) {
        this.status = status;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public ShippingFeeDTO toDTO() {
        ShippingFeeDTO shippingFeeDTO = new ShippingFeeDTO();
        shippingFeeDTO.setPointDestination(this.pointDestination);
        shippingFeeDTO.setPointSource(this.pointSource);
        shippingFeeDTO.setFee(this.fee);
        shippingFeeDTO.setStatus(this.status);
        shippingFeeDTO.setCreatedBy(this.createdBy);
        shippingFeeDTO.setCreatedDate(this.createdDate);
        shippingFeeDTO.setUpdatedBy(this.updatedBy);
        shippingFeeDTO.setUpdatedDate(this.updatedDate);

        return shippingFeeDTO;
    }
}
