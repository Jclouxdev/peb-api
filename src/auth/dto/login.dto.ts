import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 40)
  readonly email: string;

  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;
}
