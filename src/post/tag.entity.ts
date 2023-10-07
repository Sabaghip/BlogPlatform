import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../post/post.entity"

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