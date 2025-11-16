import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ArticleStatus } from "../interface/article.interface";
export class createArticleDto {

    @IsString()
    @IsNotEmpty()
    title:string

    @IsString()
    @IsNotEmpty()
    content:string

    @IsEnum(ArticleStatus)
    @IsNotEmpty()
    status:ArticleStatus

    @IsNotEmpty()
    @IsUUID()
     categoryId: string
}