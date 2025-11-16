import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/role.guard';
import { Roles } from './decolator/roles.decorator';
import { Role } from './enum/role.enum';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    async register (@Body() registerDto:RegisterDto){
        return await this.authService.registerUSer(registerDto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login (@Body() loginDto:LoginDto) {                
        return await this.authService.loginUser(loginDto)
    }

    @Get('getuser')
    @UseGuards(AuthGuard)
    async getUser(@Request() request):Promise<User|null>{
        return await this.authService.getUser(request.user.id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('test')
    getTest():{message:string, } {
        return {
            message: "test role guard berhasil"
        }
    }
}
