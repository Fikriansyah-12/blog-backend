import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateOrUpdateProfileDto } from './dto/createOrUpdateProfile.dto';
import { User } from 'src/auth/entities/user.entity';

@Controller('profile')
@UseGuards(AuthGuard) // hanya user yang berhasil memiliki token untuk akses user nya dan disini menggunakan auth guard yang dimana sudah saya buat di folder guard nya
export class ProfileController {
    constructor(private readonly profileService:ProfileService){}

    @Post()
    async updateOrCreateProfile(
        @Request() req,
        @Body() dto: CreateOrUpdateProfileDto,
    ):Promise<{message:string}>{
        return await this.profileService.updateOrCreateProfile(req.user.id, dto)
    }

    @Get()
    async getUserProfile(@Request() req):Promise<User|null>{
        return this.profileService.getUserProfileByToken(req.user.id)
    }
}
