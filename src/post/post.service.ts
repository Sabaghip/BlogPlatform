import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Paginated, PaginateQuery } from 'nestjs-paginate';
import { PostExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { User } from '../users/user.entity';
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
        return PostExceptionHandler.getPaginatedPostInServiceExceptionHandler(this.postRepository, user, query, this.logger);
    }

    async getPosts(user : User){
        return PostExceptionHandler.getPostsInServiceExceptionHandler(this.postRepository, user, this.logger);
    }

    async editPost(id:number, createPostDto:CreatePostDto, user:User, tagsString:string):Promise<Post>{
        const post = await this.postRepository.getPostByIdForEditOrDelete(id, user);
        const { title, content } = createPostDto;
        post.title = title;
        post.content = content;
        post.tags = [];
        this.postRepository.addTagsToPost(post, tagsString);
        return PostExceptionHandler.editPostsInServiceExceptionHandler(post, id, this.logger);
    }
}
