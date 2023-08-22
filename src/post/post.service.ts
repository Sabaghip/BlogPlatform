import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, FilterSuffix, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from 'src/users/user.entity';
import { userRoles } from 'src/users/userRoles.enum';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    private logger = new Logger("PostService")
    constructor(
        @InjectRepository(PostRepository)
        private postRepository : PostRepository,
    ){}

    async createPost(createPostDto : CreatePostDto, user:User, tags:string): Promise<Post>{
        return await this.postRepository.createPost(createPostDto, user, tags);
    }

    async deletePost(id:number, user:User):Promise<Post>{
        const post = await this.postRepository.getPostByIdForEditOrDelete(id, user);
        await this.postRepository.delete({postId : id})
        return post
    }

    async getPostsPaginated(user:User, query: PaginateQuery): Promise<Paginated<Post>> {
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

    async editPost(id:number, createPostDto:CreatePostDto, user:User, tags:string):Promise<Post>{
        const post = await this.postRepository.getPostByIdForEditOrDelete(id, user);
        const { title, content } = createPostDto;
        post.title = title;
        post.content = content;
        post.tags = tags;
        try{
            await post.save();
            delete post.author;
            return post;
        }catch(err){
            this.logger.error(`Failed to edit post with id = ${id}`, err.stack)
            throw new InternalServerErrorException()
        }
    }
}
