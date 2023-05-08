import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeUpdate,
  BaseEntity,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 20 })
  username: string;

  @Column({ type: 'varchar', nullable: false, length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  password: string;

  @Column({ type: 'boolean', default: false })
  conscentCgu: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  creationDate: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const salt = parseInt(process.env.SALT);
        this.password = await bcrypt.hash(this.password, salt);
      } catch (error) {
        throw new InternalServerErrorException('unable to hash password');
      }
    }
  }
}
