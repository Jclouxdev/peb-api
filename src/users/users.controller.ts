import {
  Body,
  Controller,
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
}
