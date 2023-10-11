import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

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
        userRepository.signUp = jest.fn().mockReturnValue(null);
        expect(userRepository.signUp({username : "username", password : "password"})).toBeNull();
    })
    it("signUp not successfully", ()=>{
      userRepository.signUp = jest.fn().mockReturnValue(BadRequestException);
      expect(userRepository.signUp({username : "username", password : "invalid password"})).toThrow();
  })
  })

  describe("signIn", ()=>{
    it("signIn successfully", ()=>{
        userRepository.signIn = jest.fn().mockReturnValue(null);
        expect(userRepository.signIn({username : "username", password : "password"})).toBeNull();
    })
    it("signIn not successfully", ()=>{
      userRepository.signIn = jest.fn().mockReturnValue(BadRequestException);
      expect(userRepository.signIn({username : "username", password : "wrong password"})).toThrow();
  })
  })
});