import { Body, Controller, Post,  Logger } from '@nestjs/common';
import { SignUpOrSignInDto } from './dto/signUpOrSignIn.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    private logger = new Logger("UsersContrller")
    constructor(
        private userService : UsersService,
    ){}

    @Post("/signUp")
    signUp(@Body() signUpDto:SignUpOrSignInDto){
        this.logger.verbose(`Someone trying to create a user. username : ${signUpDto.username}`)
        return this.userService.signUp(signUpDto);
    }

    @Post("/signIn")
    signIn(@Body() signInDto : SignUpOrSignInDto):Promise<{accessToken : string}>{
        this.logger.verbose(`Someone trying to sign in as a user. data : ${signInDto.username}`)
        return this.userService.signIn(signInDto);
    }
}
