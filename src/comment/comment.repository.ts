import { Logger, NotFoundException } from "@nestjs/common";
import { CommentExceptionHandler } from "../ExceptionHandler/ExceptionHandler";
import { Post } from "../post/post.entity";
import { User } from "../users/user.entity";
import { UserRoles } from "../users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { CreateCommentDto } from "./dto/createComment.dto";


@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment>{
    private logger = new Logger("CommentRepository")
    constructor(private dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }

    async createComment(createCommentDto : CreateCommentDto, post : Post, user : User): Promise<Comment>{
        const { content } = createCommentDto;
        const comment = new Comment();
        comment.author = user;
        comment.content = content;
        comment.post = post;
        return CommentExceptionHandler.createCommentInRepositoryExceptionHandler(comment, this.logger);
    }

    async getCommentByIdForDelete(id:number, user:User):Promise<Comment>{
        if(user.role === UserRoles.ADMIN){
            const comment = await this.findOne({where : {id}});
            if(!comment){
                this.logger.verbose(`Admin "${user.username}" tried to delete comment with id = "${id}" but there is no comment with this id.`)
                throw new NotFoundException(`there is no comment with id = "${id}"`)
            }
            return comment;
        }else{
            const comment = await this.findOne({where :{ id, authorId : user.id }});
            if(!comment){
                this.logger.verbose(`User "${user.username}" tried to delete comment with id = "${id}" but there is no comment with this id.`)
                throw new NotFoundException(`you dont have any comment with id = "${id}"`)
            }
            return comment;
        }
    }

    async getCommentByIdForEdit(id:number, user:User):Promise<Comment>{
        const comment = await this.findOne({where :{ id, authorId : user.id }});
        if(!comment){
            this.logger.verbose(`User "${user.username}" tried to edit comment with id = "${id}" but there is no comment with this id.`)
            throw new NotFoundException(`you dont have any comment with id = "${id}"`)
        }
        return comment;
    }

    async editComment(createCommentDto : CreateCommentDto, id, user : User): Promise<Comment>{
        const { content } = createCommentDto;
        const comment = await this.getCommentByIdForEdit(id, user);
        comment.content = content;
        return CommentExceptionHandler.editCommentInRepositoryExceptionHandler(comment, this.logger);
    }

    async deleteComment(id, user : User){
        const comment = await this.getCommentByIdForDelete(id, user);
        return CommentExceptionHandler.deleteCommentInRepositoryExceptionHandler(this, id, this.logger);
    }
}
