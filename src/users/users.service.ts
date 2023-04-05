import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

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

  async FindOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  async FindOneById(id: number): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { id: id } });
  }

  async UpdatePassword(
    id: number,
    passwords: UpdateUserPasswordDto,
  ): Promise<Partial<UserEntity>> {
    const fetchUser = await this.FindOneById(id);
    if (!fetchUser) {
      throw new NotFoundException(`no user found matching id : ${id}`);
    }
    if (!(await bcrypt.compare(passwords.oldPassword, fetchUser.password))) {
      throw new UnauthorizedException('invalid password');
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      // Check if the two new passwords are Eq
      throw new UnauthorizedException('passwords missmatches');
    }

    const userEntity = UserEntity.create();
    userEntity.password = passwords.newPassword;

    await UserEntity.update(id, userEntity);
    return fetchUser;
  }

  async DeleteAccount(id: number): Promise<MethodDecorator> {
    await this.userRepo.delete(id);
    return HttpCode(200);
  }
}
