import { Logger, NotFoundException } from "@nestjs/common";
import { Post } from "../post/post.entity";
import { User } from "../users/user.entity";
import { UserRoles } from "../users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { CreateCommentDto } from "./dto/createComment.dto";
import { datasourceConfig } from "src/config/DataSourceConfig";


@EntityRepository(Comment)
export class CommentRepository{
    private logger = new Logger("CommentRepository")
    private commentRepository : Repository<Comment>;
    private AppDataSource = new DataSource(datasourceConfig);
    constructor(){
        this.AppDataSource.initialize();
        this.commentRepository = new Repository<Comment>(Comment, this.AppDataSource.manager);
    }

    async save(comment : Comment): Promise<Comment>{
        await comment.save();
        delete comment.author
        return comment;
    }

    async getCommentByIdForDelete(id:number, user:User):Promise<Comment>{
        if(user.role === UserRoles.ADMIN){
            const comment = await this.commentRepository.findOne({where : {id}});
            if(!comment){
                this.logger.verbose(`Admin "${user.username}" tried to delete comment with id = "${id}" but there is no comment with this id.`)
                throw new NotFoundException(`there is no comment with id = "${id}"`)
            }
            return comment;
        }else{
            const comment = await this.commentRepository.findOne({where :{ id, authorId : user.id }});
            if(!comment){
                this.logger.verbose(`User "${user.username}" tried to delete comment with id = "${id}" but there is no comment with this id.`)
                throw new NotFoundException(`you dont have any comment with id = "${id}"`)
            }
            return comment;
        }
    }

    async getCommentByIdForEdit(id:number, user:User):Promise<Comment>{
        const comment = await this.commentRepository.findOne({where :{ id, authorId : user.id }});
        if(!comment){
            this.logger.verbose(`User "${user.username}" tried to edit comment with id = "${id}" but there is no comment with this id.`)
            throw new NotFoundException(`you dont have any comment with id = "${id}"`)
        }
        return comment;
    }


    async deleteComment(id){
        await this.commentRepository.delete({id})
        return;
    }
}
