import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { isString, validate } from "class-validator";

export class SignInOrSignUpPipe implements PipeTransform{
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
          return value;
        }
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            if(errors[0].property == "username"){
                throw new BadRequestException("username must be between 4 to 20 characters.");
            }
            else{
                throw new BadRequestException(errors[0].constraints.matches);
            }
        }
        return value;
      }
    
      private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
      }
}