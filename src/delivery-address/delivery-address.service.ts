import { Injectable, NotFoundException } from "@nestjs/common";
import { DeliveryAddressRepository } from "./repository/delivery-address.repository";

import { UserRepository } from "src/user/repository/user.repository";
import { CreateDeliveryAddressDto } from "./dto/create-delivery-address";
import { UpdateDeliveryAddressDto } from "./dto/update-delivery-address.dto";
import { CustomLoggerService } from "src/common/custom-logger/logger.service";

@Injectable()
export class DeliveryAddressService {
    constructor(
        private readonly addressRepository: DeliveryAddressRepository,
        private readonly userRepository: UserRepository,
        private readonly logger: CustomLoggerService,
    ) {}

    async addAddress(dto: CreateDeliveryAddressDto) {
        this.logger.log("배송지 생성 서비스 호출")
        const user = await this.userRepository.findOne(dto.userId); 
        if (!user) throw new NotFoundException("사용자를 찾을 수 없음");

        if (dto.isDefault) {
            await this.addressRepository.resetDefaultAddresses(user.uuid);
        }

        const address = this.addressRepository.create({
            ...dto,
            user,
        });

        return this.addressRepository.save(address);
    }

    async getAddresses(userId: string) {
        this.logger.log("모든 배송지 조회 서비스 호출")
        return await this.addressRepository.findUserAddresses(userId);
    }

    async updateAddress(id: number, dto: UpdateDeliveryAddressDto) {
        this.logger.log("배송지 업데이트 서비스 호출")
        const address = await this.addressRepository.findAddressById(id);
        if (!address) throw new NotFoundException("주소가 존재하지않습니다.");

        if (dto.isDefault) {
            await this.addressRepository.resetDefaultAddresses(address.user.uuid);
        }

        Object.assign(address, dto);
        return this.addressRepository.save(address);
    }

    async deleteAddress(id: number) {
        this.logger.log("배송지 삭제 서비스 호출")
        const result = await this.addressRepository.delete(id);
        if (!result.affected) throw new NotFoundException("배송지를 찾을 수 없습니다.");
        return ({message: "삭제되었습니다"});
    }
}