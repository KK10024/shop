import { SessionStatus } from 'src/common/enum/session';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Message } from './events.message.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user=> user.uuid)
  userId: string;

  @ManyToOne(() => User, user=> user.uuid)
  adminId: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
  })
  status: SessionStatus;
}