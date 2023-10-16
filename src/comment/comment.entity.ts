import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Post } from "../post/post.entity";

@Entity()
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    content : string;

    @Column()
    postId: number
    
    @ManyToOne(type => User, author => author.comments, { eager : false })
    author : User;

    @Column()
    authorId : number;
    
    @CreateDateColumn()
    publicationDate : Date;

    @ManyToOne(type => Post, post => post.comments, {onDelete:"CASCADE", eager : false})
    post : Post;
}