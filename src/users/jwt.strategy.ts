import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import {Strategy, ExtractJwt} from "passport-jwt"
import { JwtPayload } from "./Jwt-Payload.Interface";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private userRepository : UserRepository
    ){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : "someCode123",
        })
    }

    async validate(payload : JwtPayload) : Promise<User>{
        const {username, role} = payload;
        const user = await this.userRepository.findOne(username)

        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}