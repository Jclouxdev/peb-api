import { IsString, Length } from 'class-validator';

export class ShareMarkerDto {
  @IsString()
  @Length(2, 100)
  username: string;
}
