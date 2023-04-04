import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateMarkerDto {
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  lon: number;

  @IsNotEmpty()
  @Length(8, 200)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  categorieId: number;
}
