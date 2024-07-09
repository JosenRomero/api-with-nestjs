import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true }) // "each" tells class-validator to run the validation on each item of the array
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  tags: string[];
}
