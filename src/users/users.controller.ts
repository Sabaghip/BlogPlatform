import { Body, Controller, Post, ValidationPipe, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/signInDto.dto';
import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    private logger = new Logger("UsersContrller")
    constructor(
        private userService : UsersService,
    ){}

    @Post("/signUp")
    signUp(@Body(ValidationPipe) signUpDto:SignUpDto):Promise<void>{
        this.logger.verbose(`Someone trying to create a user. username : ${signUpDto.username}`)
        let result;
        try{
            result = this.userService.signUp(signUpDto);
            return result
        }catch(err){
            this.logger.error(`Cannot create user. data : ${signUpDto.username}`, err.stack)
            throw err
        }
    }

    @Post("/signIn")
    signIn(@Body(ValidationPipe) signInDto : SignInDto):Promise<{accessToken : string}>{
        this.logger.verbose(`Someone trying to sign in as a user. data : ${signInDto.username}`)
        let result;
        try{
            result =this.userService.signIn(signInDto);
            return result
        }catch(err){
            this.logger.error(`Cannot sign in as user. username : ${signInDto.username}`, err.stack)
            throw err
        }
    }
}
