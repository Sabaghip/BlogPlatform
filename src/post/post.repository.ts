import { BadRequestException, InternalServerErrorException} from "@nestjs/common";
import { title } from "process";
import { User } from "src/users/user.entity";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { Post } from "./post.entity";


@EntityRepository(Post)
export class PostRepository extends Repository<Post>{
    constructor(private dataSource: DataSource) {
        super(Post, dataSource.createEntityManager());
    }

    async createPost(createPostDto:CreatePostDto, user:User):Promise<Post>{
        const {title, content} = createPostDto;
        const post = new Post();
        post.title = title;
        post.content = content;
        post.author = user;
        await post.save();
        delete post.author;
        return post
    }
}
