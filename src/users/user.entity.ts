import { IsIn } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

import { userRoles } from "./userRoles.enum";

@Entity()
@Unique(["username"])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    username : string;

    @Column()
    password : string;
    
    @Column()
    salt : string;
    
    @Column()
    @IsIn([userRoles.ADMIN, userRoles.USER])
    role : userRoles;
}