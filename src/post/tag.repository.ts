import { BadRequestException, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import { title } from "process";
import { User } from "src/users/user.entity";
import { userRoles } from "src/users/userRoles.enum";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { Post } from "./post.entity";
import { Tag } from "./tag.entity";


@EntityRepository(Tag)
export class TagRepository extends Repository<Tag>{
    private logger = new Logger("TagRepository")
    constructor(private dataSource: DataSource) {
        super(Tag, dataSource.createEntityManager());
    }

    async createTag(content:string):Promise<Tag>{
        const tag = await this.findOne({where : {content : content}})
        if(!tag){
            const tag = new Tag()
            tag.content = content
            await tag.save()
            return tag
        }
        return tag;
    }
}
