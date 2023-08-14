import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { SignUpDto } from "./dto/signUp.dto";
import { User } from "./user.entity";
import { userRoles } from "./userRoles.enum";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
    async signUp(signUpDto:SignUpDto) : Promise<void>{
        const {username, password} = signUpDto;
        const user = new User();
        user.username = username,
        user.password = password;
        user.role = userRoles.USER;
        user.salt = "123"
        try{
            await user.save();
        }
        catch(err){
            if(err.code === "23505"){
                throw new BadRequestException("username is in use");
            }else{
                throw new InternalServerErrorException();
            }
        }
    }
}
