import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/user.entity";
import {Comment} from "src/comment/comment.entity"
import { Post } from "src/post/post.entity"

@Entity()
export class Tag extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    content : string;
    
    @ManyToMany(type => Post, post => post.postId)
    @JoinTable({name : "post_tag", joinColumn: {
        name: 'tagId',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'postId',
        referencedColumnName: 'postId',
      },})
    posts : Post[]
}