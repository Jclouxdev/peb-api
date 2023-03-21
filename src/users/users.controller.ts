import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userRepo: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    user: CreateUserDto,
  ) {
    return this.userRepo.insert(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user.email, req.user.id);
  }

  @Get()
  getAll() {
    return this.userRepo.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getMe(@Request() req) {
    return this.userRepo.FindOneById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-password')
  updatePassword(
    @Request() req,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    passwords: UpdateUserPasswordDto,
  ) {
    return this.userRepo.UpdatePassword(req.user.id, passwords);
  }
}
