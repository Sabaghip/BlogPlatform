import { InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostExceptionHandler } from "../ExceptionHandler/ExceptionHandler";
import { User } from "../users/user.entity";
import { UserRoles } from "../users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { Post } from "./post.entity";
import { TagRepository } from "./tag.repository";
import { datasourceConfig } from "../config/DataSourceConfig";
import { Tag } from "./tag.entity";
import { PaginateQuery } from "nestjs-paginate";


@EntityRepository(Post)
export class PostRepository{
    private logger = new Logger("PostRepository")
    private postRepository : Repository<Post>;
    private tagRepository : TagRepository;
    private AppDataSource = new DataSource(datasourceConfig);
    constructor(){
        this.AppDataSource.initialize();
        this.postRepository = new Repository<Post>(Post, this.AppDataSource.manager);
        this.tagRepository = new TagRepository();
    }

    async createPost(createPostDto:CreatePostDto, user:User, tagsString:string):Promise<Post>{
        const {title, content} = createPostDto;
        const post = new Post();
        post.title = title;
        post.content = content;
        post.author = user;
        post.tags = [];
        this.addTagsToPost(post, tagsString);
        return PostExceptionHandler.createPostInRepositoryExceptionHandler(post, this.postRepository, this.logger);
    }

    async getPostById(id:number, user:User){
        return PostExceptionHandler.getPostByIdInRepositoryExceptionHandler(this.postRepository, user,id, this.logger);
    }
    async getPostByIdForEditOrDelete(id:number, user:User){
        let result
        try{
            if(user.role == UserRoles.ADMIN)
                result = await this.postRepository.findOne({where : {postId : id}});
            else
                result = await this.postRepository.findOne({where : {postId : id, authorId : user.id}});
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

    async addTagsToPost(post : Post, tagsString : string){
        let tagsList = eval(tagsString);
        for(let i = 0; i < tagsList.length; i++){
            let tag = await this.tagRepository.createTag(tagsList[i])
            post.tags.push(tag)
        }
    }

    async deleteById(id){
        await this.postRepository.delete({postId : id})
    }

    async getPostsPaginated(user : User, query : PaginateQuery){
        return PostExceptionHandler.getPaginatedPostInServiceExceptionHandler(this.postRepository, user, query, this.logger);
    }
    async getPosts(user : User){
        return PostExceptionHandler.getPostsInServiceExceptionHandler(this.postRepository, user, this.logger);
    }
}
