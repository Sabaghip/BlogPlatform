import { InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostExceptionHandler } from "src/ExceptionHandler/ExceptionHandler";
import { User } from "src/users/user.entity";
import { userRoles } from "src/users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { Post } from "./post.entity";
import { TagRepository } from "./tag.repository";


@EntityRepository(Post)
export class PostRepository extends Repository<Post>{
    private logger = new Logger("PostRepository")
    constructor(private dataSource: DataSource,
        @InjectRepository(TagRepository)
        private tagRepository : TagRepository ) {
        super(Post, dataSource.createEntityManager())
    }

    async createPost(createPostDto:CreatePostDto, user:User, tags:string):Promise<Post>{
        const {title, content} = createPostDto;
        const post = new Post();
        post.title = title;
        post.content = content;
        post.author = user;
        post.tags = [];
        tags = eval(tags)
        for(let i = 0; i < tags.length; i++){
            let tag = await this.tagRepository.createTag(tags[i])
            post.tags.push(tag)
        }
        return PostExceptionHandler.createPostInRepositoryExceptionHandler(post, this.logger);
    }

    async getPostById(id:number, user:User){
        return PostExceptionHandler.getPostByIdInRepositoryExceptionHandler(this, user,id, this.logger);
    }
    async getPostByIdForEditOrDelete(id:number, user:User){
        let result
        try{
            if(user.role == userRoles.ADMIN)
                result = await this.findOne({where : {postId : id}});
            else
                result = await this.findOne({where : {postId : id, authorId : user.id}});
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
