import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DeliveryAddress } from "../entities/delivery-address.entity";

@Injectable()
export class DeliveryAddressRepository extends Repository<DeliveryAddress> {
    constructor(private readonly dataSource: DataSource) {
        super(DeliveryAddress, dataSource.createEntityManager());
    }
    async findUserAddresses(userId: string) {
        const queryBuilder = this.createQueryBuilder("deliveryAddress")
            .leftJoinAndSelect("deliveryAddress.user", "user") // user와 JOIN
            .where("user.uuid = :userId", { userId })
            .orderBy("deliveryAddress.isDefault", "DESC"); // 기본 주소를 내림차순으로 정렬

        return await queryBuilder.getMany();
    }

    // 사용자의 기본 주소를 모두 false로 리셋하기
    async resetDefaultAddresses(userId: string) {
        return await this.createQueryBuilder()
            .update(DeliveryAddress)
            .set({ isDefault: false })
            .where("user.uuid = :userId", { userId })
            .execute();
    }

    // 주소 ID로 주소를 찾기 (JOIN 사용)
    async findAddressById(id: number) {
        const queryBuilder =  this.createQueryBuilder("deliveryAddress")
            .leftJoinAndSelect("deliveryAddress.user", "user") // user와 JOIN
            .where("deliveryAddress.id = :id", { id });

        return await queryBuilder.getOne(); // 결과 반환
    }
}