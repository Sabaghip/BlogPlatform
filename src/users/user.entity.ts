import { IsIn } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from "bcrypt";
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

    async validatePassword(password : string):Promise<boolean>{
        if (this.password === await bcrypt.hash(password, this.salt)){
            return true;
        }
        return false;
    }
}