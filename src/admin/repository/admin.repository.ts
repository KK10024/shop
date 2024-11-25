import { DataSource, Repository } from "typeorm";
import { CreateMenuDto } from "../dto/create-menu.dto";
import { Menu } from "../entities/menu.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminRepository{
    private readonly repository: Repository<Menu>;

    constructor(
        private readonly dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(Menu);
    }
    async createMenu(menu: CreateMenuDto) {
        return await this.repository.save(menu);
    }

    async findMenu() {
        return await this.repository.find();
    }
}