import { Logger } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { SignUpDto } from "./dto/signUp.dto";
import { User } from "./user.entity";
import { UserRoles } from "./userRoles.enum";
import * as bcrypt from "bcrypt";
import { SignInDto } from "./dto/signInDto.dto";
import { UserExceptionHandler } from "src/ExceptionHandler/ExceptionHandler";

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
        user.role = UserRoles.USER;
        UserExceptionHandler.signUpInRepositoryExceptionHandler(user, signUpDto, this.logger);
        return;
    }

    async signIn(signInDto : SignInDto):Promise<User>{
        const {username, password} = signInDto;
        return UserExceptionHandler.signInInRepositoryExceptionHandler(this, signInDto, this.logger);
    } 

    async hashPassword(password : string, salt : string) : Promise<string>{
        return UserExceptionHandler.hashPasswordExceptionHnadler(password, salt, this.logger);
    }
}
