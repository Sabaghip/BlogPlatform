import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/post/post.repository';
import { User } from 'src/users/user.entity';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/createComment.dto';
import { Comment } from "src/comment/comment.entity"

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentRepository)
        private commentRepository : CommentRepository,
        @InjectRepository(PostRepository)
        private postRepository : PostRepository,
    ){}

    async createComment(createCommentDto : CreateCommentDto, postid : number, user : User):Promise<Comment>{
        return await this.commentRepository.createComment(createCommentDto, await this.postRepository.getPostById(postid, user), user);
    }
}
