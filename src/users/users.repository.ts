import { InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { datasourceConfig } from "../config/DataSourceConfig";


@EntityRepository(User)
export class UserRepository{
    private logger = new Logger("UserRepository");
    private userRepository : Repository<User>;
    private AppDataSource = new DataSource(datasourceConfig);
    constructor(){
        this.AppDataSource.initialize();
        this.userRepository = new Repository<User>(User, this.AppDataSource.manager);
    }

    async findOne(username : string) : Promise<User>{
        const user = await this.userRepository.find({where : {username:username}});
        return user[0];
    }
    async save(user:User) : Promise<void>{
        await this.userRepository.save(user);
        return;
    }

    async hashPassword(password : string, salt : string) : Promise<string>{
        try{
            return await bcrypt.hash(password, salt);
        }catch(err){
            this.logger.error(`Failed to hash password.`, err.stack);
            throw new InternalServerErrorException("Error in hashing password.");
        }
    }
}
