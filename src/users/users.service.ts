import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/signUp.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
    ){}

    async signUp(signUpDto : SignUpDto) : Promise<void>{
        return this.userRepository.signUp(signUpDto);
    }
}
