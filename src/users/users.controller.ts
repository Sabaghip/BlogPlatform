import { Body, Controller, Post, ValidationPipe, UseGuards, Req, Logger } from '@nestjs/common';
import { UserExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { SignUpOrSignInDto } from './dto/signUpOrSignIn.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    private logger = new Logger("UsersContrller")
    constructor(
        private userService : UsersService,
    ){}

    @Post("/signUp")
    signUp(@Body(ValidationPipe) signUpDto:SignUpOrSignInDto){
       return UserExceptionHandler.signUpExceptionHandler(this.userService, signUpDto, this.logger);
    }

    @Post("/signIn")
    signIn(@Body(ValidationPipe) signInDto : SignUpOrSignInDto):Promise<{accessToken : string}>{
        return UserExceptionHandler.signInExceptionHandler(this.userService, signInDto, this.logger)
    }
}
