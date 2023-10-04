import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExceptionHandler } from 'src/ExceptionHandler/ExceptionHandler';
import { SignInDto } from './dto/signInDto.dto';
import { SignUpDto } from './dto/signUp.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    private logger = new Logger("UsersService")
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private jwtService : JwtService,
    ){}

    async signUp(signUpDto : SignUpDto) : Promise<void>{
        await this.userRepository.signUp(signUpDto);
    }
    async signIn(signInDto : SignInDto): Promise<{accessToken : string}>{
        const user = await this.userRepository.signIn(signInDto);
        return await UserExceptionHandler.signInInServiceExceptionHandler(user, this.logger, this.jwtService, signInDto);
    }
}
