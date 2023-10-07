import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../post/post.repository';
import { User } from '../users/user.entity';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/createComment.dto';
import { Comment } from "../comment/comment.entity"

@Injectable()
export class CommentService {
    constructor(
        private commentRepository : CommentRepository,
        private postRepository : PostRepository,
    ){}

    async createComment(createCommentDto : CreateCommentDto, postid : number, user : User):Promise<Comment>{
        return await this.commentRepository.createComment(createCommentDto, await this.postRepository.getPostById(postid, user), user);
    }

    async editComment(id : number, createCommentDto : CreateCommentDto,  user : User):Promise<Comment>{
        return await this.commentRepository.editComment(createCommentDto, id, user);
    }

    async deleteComment(id : number, user : User){
        await this.commentRepository.deleteComment(id, user);
    }
}
