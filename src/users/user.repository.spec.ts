import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { UserExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockCreditionDto = {username : "TestUsername", password : "TestPassword"};

describe('UsersRepository', () => {
  let usersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        UserExceptionHandler
      ],
    }).compile();

    usersRepository = await module.get<UserRepository>(UserRepository);
  });

  describe("signIn", ()=>{
    it("sign in successfuly", ()=>{
      UserExceptionHandler.signInInRepositoryExceptionHandler = jest.fn().mockReturnValue(mockCreditionDto);
      expect(usersRepository.signIn(mockCreditionDto)).resolves.not.toThrow();
    })

    it("sign in not successfuly", ()=>{
      UserExceptionHandler.signInInRepositoryExceptionHandler = jest.fn().mockReturnValue(UnauthorizedException);
      expect(usersRepository.signIn(mockCreditionDto)).resolves.toThrow();
    })
  })
});