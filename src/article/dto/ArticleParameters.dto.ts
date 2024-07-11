import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ArticleParametersDto {
  @IsNotEmpty()
  @IsMongoId({
    message: 'Invalid ID',
  })
  id: string;
}
