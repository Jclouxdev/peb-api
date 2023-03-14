import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async insert(userDetails: CreateUserDto): Promise<Partial<UserEntity>> {
    const userEntity = UserEntity.create();
    const { email, username, password, conscentCgu } = userDetails;
    if (userDetails.password !== userDetails.confirmPassword) {
      throw new HttpException('passwords missmatches', 409);
    }
    const userInDb = await this.userRepo.findOne({
      where: { email },
    });
    if (userInDb) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const userNameExist = await this.userRepo.findOne({ where: { username } });
    if (userNameExist) {
      throw new HttpException(
        'Username already taken',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    userEntity.email = email;
    userEntity.username = username;
    userEntity.password = password;
    userEntity.conscentCgu = conscentCgu;
    await this.userRepo.save(userEntity);
    return userEntity;
  }

  async getAll(): Promise<UserEntity[]> {
    return await this.userRepo.find();
  }

  FindOneEmail(email: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { email: email } });
  }
}
