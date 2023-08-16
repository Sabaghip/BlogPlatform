import { BadRequestException, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import { title } from "process";
import { User } from "src/users/user.entity";
import { userRoles } from "src/users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { Post } from "./post.entity";


@EntityRepository(Post)
export class PostRepository extends Repository<Post>{
    private logger = new Logger("PostRepository")
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
        try{
            await post.save();
            delete post.author;
            return post
        }catch(err){
            this.logger.error("Failed to ceate a post in repository.", err.stack)
        }
    }

    async getPostById(id:number, user:User){
        let result
        try{
            result = await this.findOne({where : {id}});
        }catch(err){
            this.logger.error("Failed to get post from repository", err.stack);
            throw new InternalServerErrorException()
        }
        if(!result){
            this.logger.verbose(`User "${user.username} tried to get post with id = ${id} but there is not any post with this id."`)
            throw new NotFoundException(`there is no post with id = ${id}`)
        }
        return result;
    }
    async getPostByIdForEditOrDelete(id:number, user:User){
        let result
        try{
            if(user.role == userRoles.ADMIN)
                result = await this.findOne({where : {id}});
            else
                result = await this.findOne({where : {id, authorId : user.id}});
        }catch(err){
            this.logger.error("Failed to get post from repository", err.stack);
            throw new InternalServerErrorException()
        }
        if(!result){
            this.logger.verbose(`User "${user.username} tried to get post for modification with id = ${id} but there is not any post with this id."`)
            throw new NotFoundException(`there is no post with id = ${id}`)
        }
        return result;
    }
}
