import { Body, Controller, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decolator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { findOneParams } from './dto/find-one.params';
import { updateRoleDto } from './dto/update.role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAllUser();
  }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put('/:id')
    async update(@Param() params: findOneParams, @Body()updateRoleDto: updateRoleDto):Promise<User>{
        const userData = await this.findOneOrFail(params.id)
        return await this.userService.updateRoleUser(userData,updateRoleDto)
    }


  private async findOneOrFail(id: string): Promise<User> {
    const user = await this.userService.findByParams(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
