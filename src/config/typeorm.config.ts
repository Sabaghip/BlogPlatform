import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Comment } from "src/comment/comment.entity";
import { Post } from "src/post/post.entity";
import { Tag } from "src/post/tag.entity";
import { User } from "src/users/user.entity";

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