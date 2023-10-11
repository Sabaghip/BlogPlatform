
import { IsString } from "class-validator";
import { Logger } from "typeorm";

export class ExceptionDataDto {
    @IsString()
    data : string;
}