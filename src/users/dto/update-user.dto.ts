import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  email: string;

  // @IsOptional()
  // file: Express.Multer.File;

  @IsOptional()
  @Length(8, 100)
  newPassword: string;

  @IsOptional()
  @Length(8, 100)
  confirmNewPassword: string;

  @IsNotEmpty()
  @Length(8, 100)
  currentPassword: string;
}
