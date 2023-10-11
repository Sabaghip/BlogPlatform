import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

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
        PassportModule
      ],
    }).compile();
    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    });

  describe("signup", ()=>{
    it("signup successfull", async()=>{
        expect(userController.signUp({username : "username", password : "password"})).toBeNull();
    })
    it("signup not successfull", async()=>{
        expect(userController.signUp({username : "username", password : "wrongPassword"})).toThrow();
    })
  })

  describe("signin", ()=>{
    it("signin successfull", async()=>{
        expect(userController.signIn({username : "username", password : "password"})).toBeNull();
    })
    it("signin not successfull", async()=>{
        expect(userController.signIn({username : "username", password : "wrongPassword"})).toThrow();
    })
  })
});