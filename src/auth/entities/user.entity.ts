import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../enum/role.enum";

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

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}