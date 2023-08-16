import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { SignUpDto } from "./dto/signUp.dto";
import { User } from "./user.entity";
import { userRoles } from "./userRoles.enum";
import * as bcrypt from "bcrypt";
import { SignInDto } from "./dto/signInDto.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    private logger = new Logger("UserRepository")
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
    async signUp(signUpDto:SignUpDto) : Promise<void>{
        const {username, password} = signUpDto;
        const user = new User();
        user.salt = await bcrypt.genSalt();
        user.username = username,
        user.password = await this.hashPassword(password, user.salt);
        user.role = userRoles.USER;
        try{
            await user.save();
        }
        catch(err){
            if(err.code === "23505"){
                this.logger.verbose(`Cannot sign up as user because username "${signUpDto.username}" is in use `)
                throw new BadRequestException("username is in use");
            }else{
                this.logger.error(`Failed to create new user with username = "${signUpDto.username}"`, err.stack)
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(signInDto : SignInDto):Promise<User>{
        const {username, password} = signInDto;
        let user;
        try{
            user = await this.findOne({where : {username:username}})
        }catch(err){
            this.logger.error(`Failed sign in as user. username : ${signInDto.username}`, err.stack)
            throw err;
        }
        if(user && await user.validatePassword(password)){
            return user;
        }
        return null
    } 

    async hashPassword(password : string, salt : string) : Promise<string>{
        try{
            return await bcrypt.hash(password, salt);
        }catch(err){
            this.logger.error(`Failed to hash password.`, err.stack)
        }
    }
}
