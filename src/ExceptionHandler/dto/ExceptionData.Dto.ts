import { IsString } from "class-validator";

export class ExceptionDataDto {
    @IsString()
    data : string;
}