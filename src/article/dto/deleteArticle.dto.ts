import { IsNotEmpty, IsString } from "class-validator";

export class DeleteArticleDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
