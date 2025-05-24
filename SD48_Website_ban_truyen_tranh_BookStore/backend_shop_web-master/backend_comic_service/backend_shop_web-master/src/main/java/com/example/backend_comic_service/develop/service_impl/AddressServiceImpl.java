package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.model.model.AddressModel;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IAddressService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper; // THÊM IMPORT
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication; // THÊM IMPORT
import org.springframework.security.core.context.SecurityContextHolder; // THÊM IMPORT
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // THÊM IMPORT

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.Map;

@Service
@Slf4j
public class AddressServiceImpl implements IAddressService {

    @Autowired
    private UserRepository userRepository; // Giữ lại nếu cần lấy user thực hiện hành động
    @Autowired
    private ProvinceRepository provinceRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private WardRepository wardRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private OrderRepository orderRepository; // Giữ lại nếu bulkInsertAddress gốc vẫn dùng
    @Autowired
    private ModelMapper modelMapper; // ĐẢM BẢO ĐÃ INJECT VÀ CÓ BEAN

    @Override
    public void bulkInsertAddress(List<AddressModel> models, UserEntity userToAssignAddresses, UserEntity userPerformingAction, Integer isChangeOrder, OrderEntity orderEntity) {
        log.info("Executing original bulkInsertAddress for user ID: {}", userToAssignAddresses != null ? userToAssignAddresses.getId() : "UNKNOWN_USER_FOR_ADDRESS");
        try {
            if (models != null && !models.isEmpty() && userToAssignAddresses != null && userToAssignAddresses.getId() != null) {
                Integer userHandleId = (userPerformingAction != null && userPerformingAction.getId() != null) ? userPerformingAction.getId() : userToAssignAddresses.getId();

                List<String> provinceIds = models.stream().map(AddressModel::getProvinceId).filter(Objects::nonNull).distinct().collect(Collectors.toList());
                List<String> districtIds = models.stream().map(AddressModel::getDistrictId).filter(Objects::nonNull).distinct().collect(Collectors.toList());
                List<String> wardIds = models.stream().map(AddressModel::getWardId).filter(Objects::nonNull).distinct().collect(Collectors.toList());

                Map<String, ProvincesEntity> provincesMap = provinceIds.isEmpty() ? Map.of() : provinceRepository.getListById(provinceIds).stream().collect(Collectors.toMap(ProvincesEntity::getCode, Function.identity(), (v1, v2) -> v1));
                Map<String, DistrictEntity> districtsMap = districtIds.isEmpty() ? Map.of() : districtRepository.getListById(districtIds).stream().collect(Collectors.toMap(DistrictEntity::getCode, Function.identity(), (v1, v2) -> v1));
                Map<String, WardEntity> wardsMap = wardIds.isEmpty() ? Map.of() : wardRepository.getListById(wardIds).stream().collect(Collectors.toMap(WardEntity::getCode, Function.identity(), (v1, v2) -> v1));

                List<AddressEntity> addressEntities = new ArrayList<>();
                for (AddressModel item : models) {
                    AddressEntity addressEntity = new AddressEntity();
                    modelMapper.map(item, addressEntity);
                    addressEntity.setId(null); // Hàm này là bulk INSERT, nên ID phải là null để DB tự tạo

                    addressEntity.setCreatedDate(LocalDateTime.now());
                    addressEntity.setCreatedBy(userHandleId);
                    addressEntity.setUpdatedDate(LocalDateTime.now());
                    addressEntity.setUpdatedBy(userHandleId);
                    if (item.getProvinceId() != null) addressEntity.setProvince(provincesMap.get(item.getProvinceId()));
                    if (item.getDistrictId() != null) addressEntity.setDistrict(districtsMap.get(item.getDistrictId()));
                    if (item.getWardId() != null) addressEntity.setWard(wardsMap.get(item.getWardId()));
                    addressEntity.setStatus(1);
                    addressEntity.setIsDeleted(0);
                    addressEntity.setUserEntity(userToAssignAddresses);
                    addressEntity.setIsDefault(item.getIsDefault()); // Giữ nguyên isDefault từ model
                    addressEntities.add(addressEntity);
                }
                if (!addressEntities.isEmpty()) {
                    addressRepository.saveAllAndFlush(addressEntities);
                    log.info("Bulk inserted {} addresses for user ID: {}", addressEntities.size(), userToAssignAddresses.getId());
                }
            } else {
                log.warn("Address models list is empty or userToAssignAddresses/userPerformingAction is null in bulkInsertAddress.");
            }
        } catch (Exception e) {
            log.error("Error in bulkInsertAddress: {}", e.getMessage(), e);
        }
    }

    @Override
    public void bulkDelete(List<Integer> ids) {
        log.info("Executing bulkDelete for address IDs: {}", ids);
        try {
            if (ids != null && !ids.isEmpty()) {
                addressRepository.bulkDelete(ids);
                log.info("Bulk deleted {} addresses using custom query.", ids.size());
            }
        } catch (Exception e) {
            log.error("Error in bulkDelete addresses: {}", e.getMessage(), e);
        }
    }


    @Override
    @Transactional
    public void processUserAddresses(UserEntity user, List<AddressModel> requestedAddresses) {
        if (user == null || user.getId() == null) {
            log.warn("User is null or user ID is null in processUserAddresses. Skipping address processing.");
            return;
        }

        Integer tempUserIdPerformingAction = null; // Đổi tên để tránh nhầm lẫn
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            Optional<UserEntity> actionUserOpt = userRepository.findUserEntitiesByUserNameAndStatus(authentication.getName(), 1);
            if (actionUserOpt.isPresent()) {
                tempUserIdPerformingAction = actionUserOpt.get().getId();
            } else {
                log.warn("Authenticated user {} not found in DB for action logging.", authentication.getName());
            }
        }
        // Gán giá trị final cho biến sẽ dùng trong lambda
        final Integer userIdPerformingAction = (tempUserIdPerformingAction != null) ? tempUserIdPerformingAction : user.getId();


        log.info("Processing addresses for user ID: {}. Requested addresses count: {}", user.getId(), requestedAddresses != null ? requestedAddresses.size() : 0);

        Set<AddressEntity> currentDbAddressSet = addressRepository.getByUserId(user.getId());
        List<AddressEntity> currentDbAddresses = new ArrayList<>(currentDbAddressSet);

        List<AddressEntity> finalEntitiesToPersist = new ArrayList<>();
        List<AddressEntity> addressesPotentiallyKeptOrUpdated = new ArrayList<>();


        if (requestedAddresses != null && !requestedAddresses.isEmpty()) {
            List<String> pCodes = requestedAddresses.stream().map(AddressModel::getProvinceId).filter(Objects::nonNull).distinct().collect(Collectors.toList());
            List<String> dCodes = requestedAddresses.stream().map(AddressModel::getDistrictId).filter(Objects::nonNull).distinct().collect(Collectors.toList());
            List<String> wCodes = requestedAddresses.stream().map(AddressModel::getWardId).filter(Objects::nonNull).distinct().collect(Collectors.toList());

            Map<String, ProvincesEntity> provincesMap = pCodes.isEmpty() ? Map.of() : provinceRepository.getListById(pCodes).stream().collect(Collectors.toMap(ProvincesEntity::getCode, Function.identity(), (v1, v2) -> v1));
            Map<String, DistrictEntity> districtsMap = dCodes.isEmpty() ? Map.of() : districtRepository.getListById(dCodes).stream().collect(Collectors.toMap(DistrictEntity::getCode, Function.identity(), (v1, v2) -> v1));
            Map<String, WardEntity> wardsMap = wCodes.isEmpty() ? Map.of() : wardRepository.getListById(wCodes).stream().collect(Collectors.toMap(WardEntity::getCode, Function.identity(), (v1, v2) -> v1));

            for (AddressModel reqAddr : requestedAddresses) {
                if (reqAddr.getStage() != null && reqAddr.getStage() == 1) {
                    AddressEntity entityBeingProcessed;

                    if (reqAddr.getId() != null) {
                        final Integer currentReqAddrId = reqAddr.getId();
                        entityBeingProcessed = currentDbAddresses.stream()
                                .filter(dbAddr -> currentReqAddrId.equals(dbAddr.getId()))
                                .findFirst()
                                .orElseGet(() -> {
                                    log.warn("Address with ID {} from request not found for user {}. Will create as new.", currentReqAddrId, user.getId());
                                    AddressEntity newEntity = new AddressEntity();
                                    newEntity.setCreatedDate(LocalDateTime.now());
                                    newEntity.setCreatedBy(userIdPerformingAction); // Sử dụng biến final/effectively final
                                    return newEntity;
                                });
                    } else {
                        entityBeingProcessed = new AddressEntity();
                        entityBeingProcessed.setCreatedDate(LocalDateTime.now());
                        entityBeingProcessed.setCreatedBy(userIdPerformingAction); // Ở đây cũng nên dùng biến đã được gán
                    }

                    modelMapper.map(reqAddr, entityBeingProcessed);
                    entityBeingProcessed.setProvince(reqAddr.getProvinceId() != null ? provincesMap.get(reqAddr.getProvinceId()) : null);
                    entityBeingProcessed.setDistrict(reqAddr.getDistrictId() != null ? districtsMap.get(reqAddr.getDistrictId()) : null);
                    entityBeingProcessed.setWard(reqAddr.getWardId() != null ? wardsMap.get(reqAddr.getWardId()) : null);
                    entityBeingProcessed.setUserEntity(user);
                    entityBeingProcessed.setIsDefault(reqAddr.getIsDefault());
                    entityBeingProcessed.setStatus(1);
                    entityBeingProcessed.setIsDeleted(0);
                    entityBeingProcessed.setUpdatedDate(LocalDateTime.now());
                    entityBeingProcessed.setUpdatedBy(userIdPerformingAction);

                    finalEntitiesToPersist.add(entityBeingProcessed);
                    addressesPotentiallyKeptOrUpdated.add(entityBeingProcessed);
                }
            }
        }

        // Xác định những địa chỉ cần xóa: những cái có trong DB ban đầu nhưng không có trong list active mới
        List<AddressEntity> addressesToDelete = new ArrayList<>();
        for (AddressEntity dbAddr : currentDbAddresses) {
            boolean foundAsActiveInRequest = addressesPotentiallyKeptOrUpdated.stream()
                    .anyMatch(keptAddr -> dbAddr.getId().equals(keptAddr.getId()));
            if (!foundAsActiveInRequest) {
                addressesToDelete.add(dbAddr);
            }
        }
        // Xử lý thêm những địa chỉ được đánh dấu xóa tường minh từ request (stage = -1)
        if (requestedAddresses != null) {
            List<Integer> idsExplicitlyMarkedForDelete = requestedAddresses.stream()
                    .filter(r -> r.getStage() != null && r.getStage() <= 0 && r.getId() != null)
                    .map(AddressModel::getId)
                    .collect(Collectors.toList());

            for (Integer idToDelete : idsExplicitlyMarkedForDelete) {
                currentDbAddresses.stream()
                        .filter(dbAddr -> idToDelete.equals(dbAddr.getId()))
                        .findFirst()
                        .ifPresent(addr -> {
                            if (!addressesToDelete.contains(addr)) { // Tránh thêm trùng
                                addressesToDelete.add(addr);
                            }
                        });
            }
        }


        if (!addressesToDelete.isEmpty()) {
            addressRepository.deleteAllInBatch(addressesToDelete);
            log.info("Deleted {} addresses for user {}: IDs {}", addressesToDelete.size(), user.getId(), addressesToDelete.stream().map(AddressEntity::getId).collect(Collectors.toList()));
        }

        if (!finalEntitiesToPersist.isEmpty()) {
            addressRepository.saveAll(finalEntitiesToPersist);
            log.info("Saved/Updated {} addresses for user {}", finalEntitiesToPersist.size(), user.getId());
        }

        // Đảm bảo chỉ có một địa chỉ mặc định sau tất cả các thao tác
        List<AddressEntity> allCurrentAddressesOfUserAfterUpdate = new ArrayList<>(addressRepository.getByUserId(user.getId()));
        AddressEntity currentDefault = null;
        int defaultCount = 0;
        for(AddressEntity addr : allCurrentAddressesOfUserAfterUpdate){
            if(addr.getIsDeleted() == null || addr.getIsDeleted() == 0) {
                if(addr.getIsDefault() != null && addr.getIsDefault() == 1){
                    if(currentDefault == null) currentDefault = addr;
                    defaultCount++;
                }
            }
        }

        if (defaultCount > 1 && currentDefault != null) {
            log.warn("Multiple default addresses found for user {}. Normalizing to one default (ID: {}).", user.getId(), currentDefault.getId());
            List<AddressEntity> toUpdateNonDefault = new ArrayList<>();
            for (AddressEntity ad : allCurrentAddressesOfUserAfterUpdate) {
                if(ad.getIsDeleted() == null || ad.getIsDeleted() == 0) {
                    if (!ad.getId().equals(currentDefault.getId()) && (ad.getIsDefault() != null && ad.getIsDefault() == 1)) {
                        ad.setIsDefault(0);
                        toUpdateNonDefault.add(ad);
                    }
                }
            }
            if(!toUpdateNonDefault.isEmpty()) addressRepository.saveAll(toUpdateNonDefault);

        } else if (defaultCount == 0 && !allCurrentAddressesOfUserAfterUpdate.isEmpty()) {
            AddressEntity firstActiveAddress = allCurrentAddressesOfUserAfterUpdate.stream()
                    .filter(addr -> addr.getIsDeleted() == null || addr.getIsDeleted() == 0)
                    .findFirst().orElse(null);
            if (firstActiveAddress != null) {
                log.info("No default address found for user {}. Setting the first active address (ID: {}) as default.", user.getId(), firstActiveAddress.getId());
                firstActiveAddress.setIsDefault(1);
                addressRepository.save(firstActiveAddress);
            }
        }
        log.info("Finished processing addresses for user ID: {}", user.getId());
    }
}