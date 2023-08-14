import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dto/signInDto.dto';
import { SignUpDto } from './dto/signUp.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
    ){}

    async signUp(signUpDto : SignUpDto) : Promise<void>{
        return await this.userRepository.signUp(signUpDto);
    }
    async signIn(signInDto : SignInDto): Promise<string>{
        const result = await this.userRepository.signIn(signInDto);
        if(!result){
            throw new UnauthorizedException("Invalid creditionals.")
        }
        return result;
    }
}
