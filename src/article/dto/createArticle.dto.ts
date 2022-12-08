import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  siteTitle: string;
  
  @IsString()
  @IsNotEmpty()
  siteUrl: string;

  @IsString()
  abstractText: string;
}