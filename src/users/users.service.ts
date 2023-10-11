import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppExceptionFilter } from '../ExceptionHandler/ExceptionHandler';
import { SignUpOrSignInDto } from './dto/signUpOrSignIn.dto';
import { JwtPayload } from './Jwt-Payload.Interface';
import { UserRepository } from './user.repository';

@Injectable()
@UseFilters(AppExceptionFilter)
export class UsersService {
    private logger = new Logger("UsersService")
    constructor(
        private userRepository : UserRepository,
        private jwtService : JwtService,
    ){}

    async signUp(signUpDto : SignUpOrSignInDto) : Promise<void>{
        try{
            return await this.userRepository.signUp(signUpDto);
        }
        catch(err){
            if(err.code === "23505"){
                this.logger.verbose(`Cannot sign up as user because username "${signUpDto.username}" is in use`)
                throw new BadRequestException({message : "username is in use"});
            }else{
                throw new InternalServerErrorException(`Failed to create new user with username = "${signUpDto.username}"`);
            }
        }
        
    }
    async signIn(signInDto : SignUpOrSignInDto): Promise<{accessToken : string}>{
        let user;
        try{
            user = await this.userRepository.signIn(signInDto);
        }catch(err){
            this.logger.error(`Failed sign in as user. username : ${signInDto.username}`, err.stack)
            throw err;
        }
        if(!(user && await user.validatePassword(signInDto.password))){
            user = null;
        }
        if(!user){
            this.logger.verbose(`Someone tried to sign in as "${signInDto.username}" with invalid creditionals.`)
            throw new UnauthorizedException("Invalid creditionals.")
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
