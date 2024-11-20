import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUser } from '../interface/create-Interface';

@Injectable()
export class UserRepository {
  private readonly repository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async createUser(user: CreateUser) {
    return await this.repository.save(user);
  }
  async findOne(userId: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { uuid: userId },
    });
  }
}