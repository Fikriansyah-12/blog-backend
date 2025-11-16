import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([Article]),CloudinaryModule,AuthModule ],
  controllers: [ArticleController],
  providers:[ArticleService,CloudinaryService],
  exports: [ArticleService, TypeOrmModule,],
})
export class ArticleModule {}
