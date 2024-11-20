import { Injectable, NotFoundException } from "@nestjs/common";
import { DeliveryAddressRepository } from "./repository/delivery-address.repository";

import { UserRepository } from "src/user/repository/user.repository";
import { CreateDeliveryAddressDto } from "./dto/create-delivery-address";
import { UpdateDeliveryAddressDto } from "./dto/update-delivery-address.dto";

@Injectable()
export class DeliveryAddressService {
    constructor(
        private readonly addressRepository: DeliveryAddressRepository,
        private readonly userRepository: UserRepository
    ) {}

    async addAddress(dto: CreateDeliveryAddressDto) {
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
        return await this.addressRepository.findUserAddresses(userId);
    }

    async updateAddress(id: number, dto: UpdateDeliveryAddressDto) {
        const address = await this.addressRepository.findAddressById(id);
        if (!address) throw new NotFoundException("주소가 존재하지않습니다.");

        if (dto.isDefault) {
            // 기존 기본 배송지 초기화
            await this.addressRepository.resetDefaultAddresses(address.user.uuid);
        }

        Object.assign(address, dto);
        return this.addressRepository.save(address);
    }

    async deleteAddress(id: string): Promise<void> {
        const result = await this.addressRepository.delete(id);
        if (!result.affected) throw new NotFoundException("Address not found");
    }
}