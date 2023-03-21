import { IsNotEmpty, Length } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @Length(8, 100)
  oldPassword: string;

  @IsNotEmpty()
  @Length(8, 100)
  newPassword: string;

  @IsNotEmpty()
  @Length(8, 100)
  confirmNewPassword: string;
}
