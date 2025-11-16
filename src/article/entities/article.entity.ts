import { ManyToOne,Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ArticleStatus } from "../interface/article.interface";
import { User } from "src/auth/entities/user.entity";
import { Category } from "src/category/entities/category.entity";

@Entity()
export class Article{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title:string

    @Column({
        type: 'text'
    })
    content:string

    @Column({
        nullable: true
    })
    image: string

    @Column({
        type:'enum',
        enum: ArticleStatus,
        default: ArticleStatus.PENDING
    })
    status: ArticleStatus

    @ManyToOne(() => Category, (category) => category.id) // Relasi antar table
    category: Category

    @Column({
        type: 'uuid',
        nullable: true
    })
    categoryId: string

      @ManyToOne(() => User, (user) => user.id) // Relasi antar table
    user: User

    @Column({
        type: 'uuid',
        nullable: true
    })
    userId: string

    @CreateDateColumn()
    readonly createAt!: Date

    @UpdateDateColumn()
    readonly updatedAt!: Date
}
