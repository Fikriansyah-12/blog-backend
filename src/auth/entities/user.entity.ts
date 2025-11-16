import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../enum/role.enum";
import { Profile } from "src/profile/entities/profile.entity";
import { Article } from "src/article/entities/article.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({unique: true}) // dibuat unique agar tidak ada value yang sama
    name:string

    @Column({unique: true})
    email:string

     @Column()
    password:string

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    role: Role

    @OneToOne(()=> Profile,(profile)=> profile.user)
    profile: Profile

    @OneToMany(()=> Article,(article)=> article.id)
    article: Article[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}