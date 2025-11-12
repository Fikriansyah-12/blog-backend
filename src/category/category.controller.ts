import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { findOneParams } from './dto/find-one.params';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
 async findOne(@Param('id') id: string): Promise<Category> {
  const category = await this.findOneOrFail(id)
    return category
  }

  @Put(':id')
  async update(@Param() params:findOneParams, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
      const category = await this.findOneOrFail(params.id)
    return this.categoryService.update(category, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param() params: findOneParams): Promise<{message: string}> {
    const category = await this.findOneOrFail(params.id)
    await this.categoryService.remove(category)
    return {message: `Category ${params.id} Delete Successfull`}
  }

      private async findOneOrFail(id:string): Promise<Category> {
          const category = await this.categoryService.findOne(id)
          if (!category) {
              throw new NotFoundException()
          }
  
          return category
      }
}
