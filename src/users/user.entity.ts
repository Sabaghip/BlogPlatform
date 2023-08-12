import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { userRoles } from "./userRoles.enum";

@Entity()
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
    role : userRoles;
}