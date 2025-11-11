import { IsEnum, IsNotEmpty, IsString } from "class-validator";
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
}