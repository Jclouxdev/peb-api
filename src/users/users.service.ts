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
import { UpdateUserDto } from './dto/update-user.dto';

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
    const random = Math.random() * 10;
    if (random >= 0 && random < 3) {
      userEntity.avatarUrl = '/avatars/dog1.png';
    } else if (random > 3 && random <= 6) {
      userEntity.avatarUrl = '/avatars/dog2.png';
    } else if (random > 6 && random <= 9) {
      userEntity.avatarUrl = '/avatars/dog3.png';
    } else {
      userEntity.avatarUrl = '/avatars/dog4.png';
    }

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

  async DoesUserExist(username: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { username: username } });
    return user !== null ? true : false;
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

  async UpdateProfile(
    userId: number,
    body: UpdateUserDto,
  ): Promise<Partial<UserEntity>> {
    const fetchUser = await this.FindOneById(userId);
    if (!fetchUser) {
      throw new NotFoundException(`no user found matching id : ${userId}`);
    }
    if (!(await bcrypt.compare(body.currentPassword, fetchUser.password))) {
      throw new UnauthorizedException('invalid password');
    }
    if (body.newPassword !== body.confirmNewPassword) {
      // Check if the two new passwords are Eq
      throw new UnauthorizedException('passwords missmatches');
    }

    const userEntity = UserEntity.create();
    if (body.email) userEntity.email = body.email;
    if (body.newPassword) userEntity.password = body.newPassword;
    // if (file) {
    //   const fileUrl = file.buffer.toString();
    //   console.log(fileUrl);
    //   userEntity.avatarUrl = fileUrl;
    // }
    const random = Math.random() * 10;
    if (random >= 0 && random < 3) {
      userEntity.avatarUrl = '/avatars/dog1.png';
    } else if (random > 3 && random <= 6) {
      userEntity.avatarUrl = '/avatars/dog2.png';
    } else if (random > 6 && random <= 9) {
      userEntity.avatarUrl = '/avatars/dog3.png';
    } else {
      userEntity.avatarUrl = '/avatars/dog4.png';
    }

    await UserEntity.update(userId, userEntity);

    return userEntity;
  }

  async DeleteAccount(id: number): Promise<MethodDecorator> {
    await this.userRepo.delete(id);
    return HttpCode(200);
  }
}
