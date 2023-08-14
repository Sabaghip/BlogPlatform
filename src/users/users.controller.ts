import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SignInDto } from './dto/signInDto.dto';
import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService : UsersService,
    ){}

    @Post("/signUp")
    signUp(@Body(ValidationPipe) signUpDto:SignUpDto):Promise<void>{
        return this.userService.signUp(signUpDto);
    }

    @Post("/signIn")
    signIn(@Body(ValidationPipe) signInDto : SignInDto){
        return this.userService.signIn(signInDto);
    }
}
