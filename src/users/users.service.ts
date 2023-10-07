import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { SignUpOrSignInDto } from './dto/signUpOrSignIn.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    private logger = new Logger("UsersService")
    constructor(
        private userRepository : UserRepository,
        private jwtService : JwtService,
    ){}

    async signUp(signUpDto : SignUpOrSignInDto) : Promise<void>{
        await this.userRepository.signUp(signUpDto);
    }
    async signIn(signInDto : SignUpOrSignInDto): Promise<{accessToken : string}>{
        const user = await this.userRepository.signIn(signInDto);
        return await UserExceptionHandler.signInInServiceExceptionHandler(user, this.logger, this.jwtService, signInDto);
    }
}
