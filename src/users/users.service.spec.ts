import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { User } from './user.entity';

describe('UsersService', () => {
  let userService : UsersService;
  let userRepository : UserRepository;

  beforeEach(async ()=>{
    const module = await Test.createTestingModule({
        providers: [
          JwtService,
            UsersService,
            UserRepository,
        ],
    }).compile()
    userRepository = await module.get<UserRepository>(UserRepository);
    userService = await module.get<UsersService>(UsersService);
  })
  describe("signUp", ()=>{
    it("signUp successfully", ()=>{
        userRepository.save = jest.fn().mockReturnValue(null);
        expect(userService.signUp({username : "username", password : "password"})).toBeNull();
    })
    it("signUp not successfully", ()=>{
      userRepository.save = jest.fn().mockReturnValue(BadRequestException);
      expect(userService.signUp({username : "username", password : "invalid password"})).toThrow();
  })
  })

  describe("signIn", ()=>{
    it("signIn successfully", ()=>{
        let user = new User();
        userRepository.findOne = jest.fn().mockReturnValue(user);
        expect(userService.signIn({username : "username", password : "password"})).toEqual(user);
    })
    it("signIn not successfully", ()=>{
      let user = new User();
      userRepository.findOne = jest.fn().mockReturnValue(user);
      user.validatePassword = jest.fn().mockReturnValue(false);
      expect(userService.signIn({username : "username", password : "wrong password"})).toThrow();
  })
  })
});