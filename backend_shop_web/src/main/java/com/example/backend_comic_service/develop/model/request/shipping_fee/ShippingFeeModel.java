package com.example.backend_comic_service.develop.model.request.shipping_fee;


import com.example.backend_comic_service.develop.entity.ShippingFee;
import com.example.backend_comic_service.develop.entity.StatusFeeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShippingFeeModel {

    @NotBlank(message = "Điểm đi không được để trống")
    private String pointSource;

    @NotBlank(message = "Điểm đến không được để trống")
    private String pointDestination;

    @NotNull(message = "Giá tiền không được để trống")
    private Double fee;

    private StatusFeeEnum status;

    public ShippingFee toEntity() {
        ShippingFee shippingFee = new ShippingFee();
        shippingFee.setFee(this.fee);
        shippingFee.setPointDestination(this.pointDestination);
        shippingFee.setPointSource(this.pointSource);
        shippingFee.setStatus(this.status);

        return shippingFee;
    }

    public void updateShippingFee(ShippingFeeModel request, ShippingFee shippingFee) {
        if (request.getFee() != null)
            shippingFee.setFee(request.getFee());
        if (request.getStatus() != null)
            shippingFee.setStatus(request.getStatus());
        if (request.getPointDestination() != null)
            shippingFee.setPointDestination(request.getPointDestination());
        if (request.getPointSource() != null)
            shippingFee.setPointSource(request.getPointSource());
    }
}
