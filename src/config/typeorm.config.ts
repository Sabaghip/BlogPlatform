import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";

export const typeOrmConfig : TypeOrmModuleOptions ={
    type : "postgres",
    host : "localhost",
    port : 5432,
    username : "postgres",
    password : "123456",
    database : "blog-platform",
    entities : [User],
    synchronize : true,
}