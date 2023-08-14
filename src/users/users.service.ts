import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dto/signInDto.dto';
import { SignUpDto } from './dto/signUp.dto';
import { JwtPayload } from './Jwt-Payload.Interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private jwtService : JwtService,
    ){}

    async signUp(signUpDto : SignUpDto) : Promise<void>{
        return await this.userRepository.signUp(signUpDto);
    }
    async signIn(signInDto : SignInDto): Promise<{accessToken : string}>{
        const user = await this.userRepository.signIn(signInDto);
        if(!user){
            throw new UnauthorizedException("Invalid creditionals.")
        }
        const payload : JwtPayload = { username : user.username, role : user.role };
        const accessToken = await this.jwtService.sign(payload);
        return {accessToken};
    }
}
