import { User } from './user.entity';
import { UserRoles } from './userRoles.enum';
import * as bcrypt from "bcrypt";
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let userController : UsersController;
  let userService : UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersController,
        UsersService,
        UserExceptionHandler,
      ],
    }).compile();
    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    });

  describe("signup", ()=>{
    it("signup successfull", async()=>{
        UserExceptionHandler.signUpExceptionHandler = jest.fn().mockReturnValue(null);
        expect(userController.signUp({username : "username", password : "password"})).resolves.not.toThrow();
    })
    it("signup not successfull", async()=>{
        UserExceptionHandler.signUpExceptionHandler = jest.fn().mockReturnValue(UnauthorizedException);
        expect(userController.signUp({username : "username", password : "wrongPassword"})).resolves.toThrow();
    })
  })

  describe("signin", ()=>{
    it("signin successfull", async()=>{
        UserExceptionHandler.signInExceptionHandler = jest.fn().mockReturnValue(null);
        expect(userController.signUp({username : "username", password : "password"})).resolves.not.toThrow();
    })
    it("signin not successfull", async()=>{
        UserExceptionHandler.signInExceptionHandler = jest.fn().mockReturnValue(UnauthorizedException);
        expect(userController.signUp({username : "username", password : "wrongPassword"})).resolves.toThrow();
    })
  })
});