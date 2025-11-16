import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { updateRoleDto } from './dto/update.role.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>
    ){}

    async findAllUser():Promise<User[]>{
        const user = await this.userRepository.find({
            relations: ['profile'],
            select: {
                id:true,
                name:true,
                email:true,
                role:true,
                profile: {
                    age: true,
                    bio: true
                },
                createdAt: true,
                updatedAt: true
            }
        })
        return user
    }

    async findByParams(id:string):Promise<User | null>{
       const user = await this.userRepository.findOneBy({id})

    return user;
    }

    async updateRoleUser(user:User, updateRoleDto:updateRoleDto):Promise<User>{
        Object.assign(user, updateRoleDto)
        return await this.userRepository.save(user)
    }
}
