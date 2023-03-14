import { IsNotEmpty, IsEmail, Length, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(5, 40)
  email: string;

  @IsNotEmpty()
  @Length(8, 100)
  password: string;

  @IsNotEmpty()
  @Length(8, 100)
  confirmPassword: string;

  @IsNotEmpty()
  @IsBoolean()
  conscentCgu: boolean;
}
