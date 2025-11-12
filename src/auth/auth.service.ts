import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enum/role.enum';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService:JwtService,
  ) {}

  async registerUSer(registerDto: RegisterDto): Promise<{ message: string }> {
    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    const userEmail = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    const userName = await this.userRepository.findOneBy({
      name: registerDto.name,
    });

    if (userEmail) {
      throw new ConflictException('Email is alredy exist');
    }

    if (userName) {
      throw new ConflictException('Name is alredy exist');
    }

    const userData = await this.userRepository.find()
    const roleUser:Role = userData.length === 0 ? Role.ADMIN : Role.USER

    const newUser = await this.userRepository.create({
      ...registerDto,
      password: hashPassword,
      role: roleUser
    });

    await this.userRepository.save(newUser)
    return {
        message: 'Register User Berhasil'
    }
  }

  async loginUser(loginDto: LoginDto):Promise<{ access_token: string; user: { id: string; name: string; email: string; role?: string } }>{
    const user = await this.userRepository.findOne({
        where:{email:loginDto.email},
        select: { id: true, name: true, email: true, password: true },
    })

    if (!user) {
        throw new UnauthorizedException("Invalid Credentials")
    }
    if (!(await bcrypt.compare (loginDto.password, user.password))) {
        throw new UnauthorizedException("Invalid Credentials")
    }
    const payload = {id: user.id, email: user.email, role: user.role}


    return {
        user: { id: user.id, name: (user as any).name, email: user.email, role: (user as any).role?.name ?? (user as any).role },
        access_token: await this.jwtService.signAsync(payload),
    }
  }
}
