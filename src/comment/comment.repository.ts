import { InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Post } from "src/post/post.entity";
import { User } from "src/users/user.entity";
import { userRoles } from "src/users/userRoles.enum";
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
        try {
            await comment.save();
            delete comment.author
            return comment;
        }catch(err){
            this.logger.error("Failed to add comment to repository", err.stack)
            throw new InternalServerErrorException()
        }
    }

    async getCommentByIdForDelete(id:number, user:User):Promise<Comment>{
        if(user.role === userRoles.ADMIN){
            const comment = await this.findOne({where : {id}});
            if(!comment){
                this.logger.verbose(`Admin "${user.username} tried to delete comment with id = ${id}" but there is no comment with this id.`)
                throw new NotFoundException(`there is no comment with id = ${id}`)
            }
            return comment;
        }else{
            const comment = await this.findOne({where :{ id, authorId : user.id }});
            if(!comment){
                this.logger.verbose(`User "${user.username} tried to delete comment with id = ${id}" but there is no comment with this id.`)
                throw new NotFoundException(`you dont have any comment with id = ${id}`)
            }
            return comment;
        }
    }

    async getCommentByIdForEdit(id:number, user:User):Promise<Comment>{
        const comment = await this.findOne({where :{ id, authorId : user.id }});
        if(!comment){
            this.logger.verbose(`User "${user.username} tried to edit comment with id = ${id}" but there is no comment with this id.`)
            throw new NotFoundException(`you dont have any comment with id = ${id}`)
        }
        return comment;
    }

    async editComment(createCommentDto : CreateCommentDto, id, user : User): Promise<Comment>{
        const { content } = createCommentDto;
        const comment = await this.getCommentByIdForEdit(id, user);
        comment.content = content;
        try{
            await comment.save();
            delete comment.author
            return comment;
        }catch(err){
            this.logger.error("Failed to edit a comment in repository.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    async deleteComment(id, user : User){
        const comment = await this.getCommentByIdForDelete(id, user);
        try{
            await this.delete({id})
        }catch(err){
            this.logger.error("Failed to delete a comment from repository.", err.stack)
            throw new InternalServerErrorException()
        }
    }
}
