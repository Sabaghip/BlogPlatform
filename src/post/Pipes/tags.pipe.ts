import { BadRequestException, PipeTransform } from "@nestjs/common";
import { isString } from "class-validator";

export class TagsPipe implements PipeTransform{
    transform(value){
        try{
            const tags = eval(value)
            for(let i = 0; i < tags.lenght; i++){
                if(!isString(tags[i])){
                    throw new BadRequestException("tags must be an array of strings")
                }
            }
            return value;    
        }
        catch(e){
            throw new BadRequestException("tags must be an array of strings")
        }
    }
}