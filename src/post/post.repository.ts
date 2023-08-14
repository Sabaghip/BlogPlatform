import { BadRequestException, InternalServerErrorException} from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Post } from "./post.entity";


@EntityRepository(Post)
export class PostRepository extends Repository<Post>{
    constructor(private dataSource: DataSource) {
        super(Post, dataSource.createEntityManager());
    }
   
}
