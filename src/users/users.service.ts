import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionWithData } from '../ExceptionHandler/Exceptions';
import { AppExceptionFilter } from '../ExceptionHandler/ExceptionHandler';
import { SignUpOrSignInDto } from './dto/signUpOrSignIn.dto';
import { JwtPayload } from './Jwt-Payload.Interface';
import { UserRepository } from './users.repository';
import { User } from './user.entity';
import * as bcrypt from "bcrypt";
import { UserRoles } from './userRoles.enum';

@Injectable()
@UseFilters(AppExceptionFilter)
export class UsersService {
    private logger = new Logger("UsersService")
    constructor(
        private userRepository : UserRepository,
        private jwtService : JwtService,
    ){}

    async signUp(signUpDto : SignUpOrSignInDto) : Promise<void>{
        const {username, password} = signUpDto;
        const user = new User();
        user.salt = await bcrypt.genSalt();
        user.username = username,
        user.password = await this.userRepository.hashPassword(password, user.salt);
        user.role = UserRoles.USER;
        try{
            return await this.userRepository.save(user);
        }
        catch(err){
            if(err.code === "23505"){
                this.logger.verbose(`Cannot sign up as user because username "${signUpDto.username}" is in use`)
                throw new HttpExceptionWithData(new BadRequestException({message : "username is in use"}),{data : `Cannot sign up as user because username "${signUpDto.username}" is in use`});
            }else{
                throw new InternalServerErrorException(`Failed to create new user with username = "${signUpDto.username}"`);
            }
        }
    }
    async signIn(signInDto : SignUpOrSignInDto): Promise<{accessToken : string}>{
        let user;
        try{
            user = await this.userRepository.findOne(signInDto.username)
        }catch(err){
            this.logger.error(`Failed sign in as user. username : ${signInDto.username}`, err.stack)
            throw err;
        }
        if(!(user && await user.validatePassword(signInDto.password))){
            this.logger.verbose(`Someone tried to sign in as "${signInDto.username}" with invalid creditionals.`)
            throw new HttpExceptionWithData(new UnauthorizedException("Invalid creditionals."), {data : `Someone tried to sign in as "${signInDto.username}" with invalid creditionals.`})
        }
        try{
            const payload : JwtPayload = { username : user.username, role : user.role };
            const accessToken = await this.jwtService.sign(payload);
            return {accessToken};
        }catch(err){
            throw new InternalServerErrorException(`Cannot sign in as user. username : ${signInDto.username}`)
        }
    }
}
