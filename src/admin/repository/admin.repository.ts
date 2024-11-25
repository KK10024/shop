import { DataSource, Repository } from "typeorm";
import { Menu } from "../entities/menu.entity";


export class AdminRepository {
    private readonly repository: Repository<Menu>;

    constructor(private readonly dataSource: DataSource) {
      this.repository = this.dataSource.getRepository(Menu);
    }
    async createMeun(menu){
        const saveMenu = await this.repository.create(menu);
        return await this.repository.save(saveMenu);
    }
    async findMeun(){
        return await this.repository.find();
    }
}