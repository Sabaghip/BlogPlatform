import { BadRequestException, InternalServerErrorException} from "@nestjs/common";
import { User } from "src/users/user.entity";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Comment } from "./comment.entity";


@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment>{
    constructor(private dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }

    
}
