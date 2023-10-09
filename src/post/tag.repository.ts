import { InternalServerErrorException, Logger } from "@nestjs/common";
import { datasourceConfig } from "../config/DataSourceConfig";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Tag } from "./tag.entity";


@EntityRepository(Tag)
export class TagRepository{
    private logger = new Logger("TagRepository")
    private tagRepository : Repository<Tag>;
    private AppDataSource = new DataSource(datasourceConfig);
    constructor(){
        this.AppDataSource.initialize();
        this.tagRepository = new Repository<Tag>(Tag, this.AppDataSource.manager);
    }

    async createTag(content:string):Promise<Tag>{
        let tag;
        try{
            tag = await this.tagRepository.findOne({where : {content : content}})
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
