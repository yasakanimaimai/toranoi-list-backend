import { IsNotEmpty, IsString } from "class-validator";

export class UpdateArticleDto {

  @IsString()
  @IsNotEmpty()
  id: string;
  
  @IsString()
  @IsNotEmpty()
  siteTitle: string;
  
  @IsString()
  @IsNotEmpty()
  siteUrl: string;

  @IsString()
  abstractText: string;
}