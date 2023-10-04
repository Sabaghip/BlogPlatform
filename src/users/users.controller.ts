import { Body, Controller, Post, ValidationPipe, UseGuards, Req, Logger } from '@nestjs/common';
import { UserExceptionHandler } from 'src/ExceptionHandler/ExceptionHandler';
import { SignInDto } from './dto/signInDto.dto';
import { SignUpDto } from './dto/signUp.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    private logger = new Logger("UsersContrller")
    constructor(
        private userService : UsersService,
    ){}

    @Post("/signUp")
    signUp(@Body(ValidationPipe) signUpDto:SignUpDto){
       return UserExceptionHandler.signUpExceptionHandler(this.userService, signUpDto, this.logger);
    }

    @Post("/signIn")
    signIn(@Body(ValidationPipe) signInDto : SignInDto):Promise<{accessToken : string}>{
        return UserExceptionHandler.signInExceptionHandler(this.userService, signInDto, this.logger)
    }
}
