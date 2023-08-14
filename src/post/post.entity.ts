import { IsIn, isNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "src/users/user.entity";

@Entity()
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    title : string;

    @Column()
    content : string;
    
    @ManyToOne(type => User, author => author.posts, { eager : false })
    author : User;

    @Column()
    authorId : number;
    
    @CreateDateColumn()
    publicationDate : Date

    // @Column()
    // tags : string[]
}