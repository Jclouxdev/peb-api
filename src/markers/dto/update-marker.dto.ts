import { IsOptional, Length } from 'class-validator';

export class UpdateMarkerDto {
  @IsOptional()
  @Length(2, 100)
  name: string;

  @IsOptional()
  @Length(8, 200)
  description: string;
}
