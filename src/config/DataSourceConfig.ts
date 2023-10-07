import { Post } from "../post/post.entity";
import { Tag } from "../post/tag.entity";
import { User } from "../users/user.entity";
import { DataSourceOptions } from "typeorm";
import { Comment } from "../comment/comment.entity";

export const datasourceConfig : DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123456",
    database: "blog-platform",
    entities : [User, Comment, Post, Tag],
    synchronize : true,
};