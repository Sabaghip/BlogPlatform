import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Comment } from "../comment/comment.entity";
import { Post } from "../post/post.entity";
import { Tag } from "../post/tag.entity";
import { User } from "../users/user.entity";

export const typeOrmConfig : TypeOrmModuleOptions ={
    type : "postgres",
    host : "localhost",
    port : 5432,
    username : "postgres",
    password : "123456",
    database : "blog-platform",
    entities : [User, Post, Comment, Tag],
    synchronize : true,
}