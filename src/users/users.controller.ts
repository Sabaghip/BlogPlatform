import { Body, Controller, Post, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    signIn(@Body(ValidationPipe) signInDto : SignInDto):Promise<{accessToken : string}>{
        return this.userService.signIn(signInDto);
    }

    @Post("/test")
    @UseGuards(AuthGuard())
    test(@Req() req){
        console.log(req);
    }
}
