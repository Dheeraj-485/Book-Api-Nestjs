import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}
