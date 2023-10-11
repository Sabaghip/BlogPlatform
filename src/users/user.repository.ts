import { InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { SignUpOrSignInDto } from "./dto/signUpOrSignIn.dto";
import { User } from "./user.entity";
import { UserRoles } from "./userRoles.enum";
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
    async signUp(signUpDto:SignUpOrSignInDto) : Promise<void>{
        const {username, password} = signUpDto;
        const user = new User();
        user.salt = await bcrypt.genSalt();
        user.username = username,
        user.password = await this.hashPassword(password, user.salt);
        user.role = UserRoles.USER;
        await this.userRepository.save(user);
        return;
    }

    async signIn(signInDto : SignUpOrSignInDto):Promise<User>{
        let user;
        user = await this.findOne(signInDto.username)
        if(user && await user.validatePassword(signInDto.password)){
            return user;
        }
        return null
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
