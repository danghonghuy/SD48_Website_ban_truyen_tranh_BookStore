//package com.example.backend_comic_service.develop.mapper;
//
//import com.example.backend_comic_service.develop.entity.ShippingFee;
//import com.example.backend_comic_service.develop.model.dto.ShippingFeeDTO;
//import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeModel;
//import org.mapstruct.*;
//
//import java.time.LocalDateTime;
//
//@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
//public interface ShippingFeeMapper {
//
//    @Mapping(target = "createdDate", ignore = true)
//    ShippingFee toEntity(ShippingFeeModel model);
//
//    @AfterMapping
//    default void setCurrentTime(@MappingTarget ShippingFee source) {
//        source.setCreatedDate(LocalDateTime.now());
//    }
//
//    void updateShippingFee(ShippingFeeModel source, @MappingTarget ShippingFee entity);
//
//    ShippingFeeDTO toDTO(ShippingFee entity);
//}
