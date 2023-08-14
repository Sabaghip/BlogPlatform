import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostRepository)
        private postRepository : PostRepository,
    ){}

    async createPost(createPostDto : CreatePostDto, user:User): Promise<Post>{
        return await this.postRepository.createPost(createPostDto, user);
    }
}
