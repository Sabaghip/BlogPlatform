import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { CanActivate } from '@nestjs/common';

describe('UsersService', () => {
  let userService : UsersService;
  let userRepository : UserRepository;

  beforeEach(async ()=>{
    const module = await Test.createTestingModule({
        providers: [
            UsersService,
            UserRepository,
        ],
    }).compile()
    userRepository = await module.get<UserRepository>(UserRepository);
    userService = await module.get<UsersService>(UsersService);
  })
  describe("signUp", ()=>{
    it("signUp successfully", ()=>{
      userRepository.signUp = jest.fn();
        expect(userRepository.signUp).not.toThrow();
    })
  })
});