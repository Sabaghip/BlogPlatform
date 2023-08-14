import { createParamDecorator } from "@nestjs/common";
import { User } from "../../users/user.entity";

export const GetUser = createParamDecorator((data, req)=>{
    return req;
});