import { IsInt } from "class-validator";

export class PostIdDto {
    @IsInt()
    id : number
}