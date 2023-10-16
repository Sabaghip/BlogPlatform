import { Injectable } from '@nestjs/common';
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
        let post = await this.postRepository.getPostById(postid, user);
        const { content } = createCommentDto;
        const comment = new Comment();
        comment.author = user;
        comment.content = content;
        comment.postId = post.id;
        await this.commentRepository.save(comment);
        comment.post = await this.postRepository.getPostById(postid, user);
        return comment;
    }

    async editComment(commentid : number, createCommentDto : CreateCommentDto,  user : User):Promise<Comment>{
        const { content } = createCommentDto;
        const comment = await this.commentRepository.getCommentByIdForEdit(commentid, user);
        comment.content = content;
        return await this.commentRepository.save(comment);
    }

    async deleteComment(commentid : number, user : User){
        const comment = await this.commentRepository.getCommentByIdForDelete(commentid, user);
        await this.commentRepository.deleteComment(comment.id);
    }
}
