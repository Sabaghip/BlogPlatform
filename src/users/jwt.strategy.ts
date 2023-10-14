import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"
import { JwtPassword } from "src/config/Parameters";
import { JwtPayload } from "./Jwt-Payload.Interface";
import { User } from "./user.entity";
import { UserRepository } from "./users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private userRepository : UserRepository
    ){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : JwtPassword,
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