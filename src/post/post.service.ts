import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostRepository)
        private postRepository : PostRepository,
    ){}
}
