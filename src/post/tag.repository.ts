import { InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Tag } from "./tag.entity";


@EntityRepository(Tag)
export class TagRepository extends Repository<Tag>{
    private logger = new Logger("TagRepository")
    constructor(private dataSource: DataSource) {
        super(Tag, dataSource.createEntityManager());
    }

    async createTag(content:string):Promise<Tag>{
        let tag;
        try{
            tag = await this.findOne({where : {content : content}})
        }
        catch(err){
            this.logger.error("Failed to get tag from repository", err.stack);
            throw new InternalServerErrorException()
        }
        if(!tag){
            const tag = new Tag()
            tag.content = content
            try{
                await tag.save()
            }
            catch(err){
                this.logger.error("Failed to create tag in tag repository", err.stack);
                throw new InternalServerErrorException()
            }
            return tag
        }
        return tag;
    }
}
