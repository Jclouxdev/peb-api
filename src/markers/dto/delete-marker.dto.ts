import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteMarkerDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
