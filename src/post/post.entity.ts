import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/user.entity";
import {Comment} from "src/comment/comment.entity"

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

    @Column()
    tags : string;

    @OneToMany(type => Comment, comment => comment.post, { eager : true })
    comments : Comment[];
}