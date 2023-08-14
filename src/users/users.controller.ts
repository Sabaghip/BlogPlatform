import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
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
}
