import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig : TypeOrmModuleOptions ={
    type : "postgres",
    host : "localhost",
    port : 5432,
    username : "postgres",
    password : "123456",
    database : "blog-platform",
    entities : [__dirname + "/../**/*.entity.ts"],
    synchronize : true,
}