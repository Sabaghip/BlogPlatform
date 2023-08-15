import { BadRequestException, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import { title } from "process";
import { User } from "src/users/user.entity";
import { userRoles } from "src/users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { Post } from "./post.entity";


@EntityRepository(Post)
export class PostRepository extends Repository<Post>{
    constructor(private dataSource: DataSource) {
        super(Post, dataSource.createEntityManager());
    }

    async createPost(createPostDto:CreatePostDto, user:User, tags:string):Promise<Post>{
        const {title, content} = createPostDto;
        const post = new Post();
        post.title = title;
        post.content = content;
        post.author = user;
        post.tags = tags;
        await post.save();
        delete post.author;
        return post
    }

    async getPostById(id:number, user:User){
        if(user.role === userRoles.ADMIN){
            const result = await this.findOne({where : {id}});
            if(!result){
                throw new NotFoundException(`there is no post with id = ${id}`)
            }
            return result;
        }
        else{
            const result = await this.findOne({where :{ id, authorId : user.id }});
            if(!result){
                throw new NotFoundException(`you dont have any post with id = ${id}`)
            }
            return result;
        }
    }
    
}
