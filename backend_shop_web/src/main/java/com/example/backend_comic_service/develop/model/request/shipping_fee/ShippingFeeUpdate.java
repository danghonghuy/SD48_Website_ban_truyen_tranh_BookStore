package com.example.backend_comic_service.develop.model.request.shipping_fee;


import com.example.backend_comic_service.develop.entity.ShippingFee;
import com.example.backend_comic_service.develop.entity.StatusFeeEnum;
import lombok.Data;

@Data
public class ShippingFeeUpdate {

    private String pointSource;

    private String pointDestination;

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

    public void updateShippingFee(ShippingFeeUpdate request, ShippingFee shippingFee) {
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
