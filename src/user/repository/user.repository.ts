import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import dayjs from 'dayjs';
import { CreateUser } from '../type/create-user.type';

@Injectable()
export class UserRepository {
  private readonly repository: Repository<User>;

  constructor(
    private readonly dataSource: DataSource) {
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
  async getNewUsers(day: number){ 
      const startDate = dayjs().subtract(day, 'day').startOf('day').toDate();
      const endDate = dayjs().subtract(day, 'day').endOf('day').toDate();
  
      const user = await this.repository
          .createQueryBuilder('user')
          .where('user.createdAt >= :start', { start: startDate })
          .andWhere('user.createdAt <= :end', { end: endDate })
          .getMany();
  
      return user;
  }
}