import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {  Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    private logger = new Logger("PostService")
    constructor(
        private postRepository : PostRepository,
    ){}

    async createPost(createPostDto : CreatePostDto, user:User, tagsString:string): Promise<Post>{
        const {title, content} = createPostDto;
        const post = new Post();
        post.title = title;
        post.content = content;
        post.author = user;
        post.tags = [];
        await this.postRepository.addTagsToPost(post, tagsString);
        return await this.postRepository.save(post);
    }

    async deletePost(postId:number, user:User):Promise<Post>{
        const post = await this.postRepository.getPostByIdForEditOrDelete(postId, user);
        await this.postRepository.deleteById(postId)
        return post
    }

    async getPostsPaginated(user:User, query: PaginateQuery): Promise<Paginated<Post>> {
        return this.postRepository.getPostsPaginated(user, query);
    }

    async getPosts(user : User){
        return this.postRepository.getPosts(user);
    }

    async editPost(postId:number, createPostDto:CreatePostDto, user:User, tagsString:string):Promise<Post>{
        const post = await this.postRepository.getPostByIdForEditOrDelete(postId, user);
        const { title, content } = createPostDto;
        post.title = title;
        post.content = content;
        post.tags = [];
        await this.postRepository.addTagsToPost(post, tagsString);
        try{
            await this.postRepository.save(post);
            delete post.author;
            return post;
        }catch(err){
            this.logger.error(`Failed to edit post with id = ${postId}`, err.stack)
            throw new InternalServerErrorException()
        }
    }
}
