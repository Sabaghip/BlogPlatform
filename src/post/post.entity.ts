import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import {Comment} from "../comment/comment.entity"
import { Tag } from "./tag.entity";

@Entity()
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    postId : number;

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


    @OneToMany(type => Comment, comment => comment.post, { eager : true })
    comments : Comment[];

    @ManyToMany(type => Tag, tag => tag.id, {eager : true})
    @JoinTable({name : "post_tag", joinColumn: {
        name: 'postId',
        referencedColumnName: 'postId',
      },
      inverseJoinColumn: {
        name: 'tagId',
        referencedColumnName: 'id',
      },})
    tags : Tag[]
}