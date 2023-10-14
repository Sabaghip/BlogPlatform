import { Logger, NotFoundException } from "@nestjs/common";
import { User } from "../users/user.entity";
import { UserRoles } from "../users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Comment } from "./comment.entity";
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
        delete comment.author;
        return comment;
    }

    async getCommentByIdForDelete(commentid:number, user:User):Promise<Comment>{
        if(user.role === UserRoles.ADMIN){
            const comment = await this.commentRepository.findOne({where : { id : commentid }});
            if(!comment){
                this.logger.verbose(`Admin "${user.username}" tried to delete comment with id = "${commentid}" but there is no comment with this id.`)
                throw new NotFoundException(`there is no comment with id = "${commentid}"`)
            }
            return comment;
        }else{
            const comment = await this.commentRepository.findOne({where :{ id : commentid, authorId : user.id }});
            if(!comment){
                this.logger.verbose(`User "${user.username}" tried to delete comment with id = "${commentid}" but there is no comment with this id.`)
                throw new NotFoundException(`you dont have any comment with id = "${commentid}"`)
            }
            return comment;
        }
    }

    async getCommentByIdForEdit(commentid:number, user:User):Promise<Comment>{
        const comment = await this.commentRepository.findOne({where :{ id : commentid, authorId : user.id }});
        if(!comment){
            this.logger.verbose(`User "${user.username}" tried to edit comment with id = "${commentid}" but there is no comment with this id.`)
            throw new NotFoundException(`you dont have any comment with id = "${commentid}"`)
        }
        return comment;
    }


    async deleteComment(commentid){
        await this.commentRepository.delete({id : commentid})
        return;
    }
}
