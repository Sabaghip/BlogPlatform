import { IsIn } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserRoles } from "./userRoles.enum";
import { Post } from "../post/post.entity";
import { Comment } from "../comment/comment.entity";

@Entity()
@Unique(["username"])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    username : string;

    @Column()
    password : string;
    
    @Column()
    salt : string;
    
    @Column()
    @IsIn([UserRoles.ADMIN, UserRoles.USER])
    role : UserRoles;

    @OneToMany(type => Post, post => post.author, { eager : true })
    posts : Post[];

    @OneToMany(type => Comment, comment => comment.author, { eager : true })
    comments : Comment[];


    async validatePassword(password : string):Promise<boolean>{
        if (this.password === await bcrypt.hash(password, this.salt)){
            return true;
        }
        return false;
    }
}