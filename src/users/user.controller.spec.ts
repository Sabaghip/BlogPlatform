import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let userController : UsersController;
  let userService : UsersService;
  let userRepository : UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        UsersController,
        UsersService,
        UserRepository,
        UserExceptionHandler,
      ],
    }).compile();
    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    });

  describe("signup", ()=>{
    it("signup successfull", async()=>{
        UserExceptionHandler.signUpExceptionHandler = jest.fn().mockReturnValue(null);
        expect(userController.signUp({username : "username", password : "password"})).toBeNull();
    })
    it("signup not successfull", async()=>{
        UserExceptionHandler.signUpExceptionHandler = jest.fn().mockReturnValue(UnauthorizedException);
        expect(userController.signUp({username : "username", password : "wrongPassword"})).toThrow();
    })
  })

  describe("signin", ()=>{
    it("signin successfull", async()=>{
        UserExceptionHandler.signInExceptionHandler = jest.fn().mockReturnValue(null);
        expect(userController.signIn({username : "username", password : "password"})).toBeNull();
    })
    it("signin not successfull", async()=>{
        UserExceptionHandler.signInExceptionHandler = jest.fn().mockReturnValue(UnauthorizedException);
        expect(userController.signIn({username : "username", password : "wrongPassword"})).toThrow();
    })
  })
});