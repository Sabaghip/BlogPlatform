import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpOrSignInDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username : string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message : "password is weak."})
    password : string;
}