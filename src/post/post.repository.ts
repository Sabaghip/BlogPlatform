import { InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import { User } from "../users/user.entity";
import { UserRoles } from "../users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { Post } from "./post.entity";
import { TagRepository } from "./tag.repository";
import { datasourceConfig } from "../config/DataSourceConfig";
import { FilterOperator, paginate, PaginateQuery } from "nestjs-paginate";


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

    async save(post : Post):Promise<Post>{
        try{
            await post.save();
            delete post.author;
            return await post;
        }catch(err){
            this.logger.error(`Failed to create post with id = ${post.postId}`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    async getPostById(id:number, user:User){
        let result
        try{
            result = await this.postRepository.findOne({where : {postId : id}});
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
        let result;
        try{
            result =  await paginate(query, this.postRepository, {
                loadEagerRelations: true,
                sortableColumns: ['postId', 'publicationDate', 'title', 'content', "tags.content"],
                nullSort: 'last',
                defaultSortBy: [['postId', 'DESC']],
                searchableColumns: ['title', 'content'],
                // select: ['postId', 'publicationDate', 'title', 'content', 'authorId', "tags.content"],
                filterableColumns: {
                'tags.content': [FilterOperator.IN],
                loadEagerRelations: true,
                },
            })
            this.logger.verbose(`"${user.username}" got paginated posts.`)
            return result;
        }
        catch(err){
            this.logger.error("Failed to get paginated posts.", err.stack)
            throw new InternalServerErrorException()
        }
    }
    async getPosts(user : User){
        let result;
        try{
            result = await this.postRepository.find({relations : ["tags"]});
            this.logger.verbose(`"${user.username}" got posts.`)
            return result
        }catch(err){
            this.logger.error("Failed to get posts.", err.stack)
            throw new InternalServerErrorException()
        }
    }
}
