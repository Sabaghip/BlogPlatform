import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

const mockCreditionDto = {username : "TestUsername", password : "TestPassword"};

describe('UsersRepository', () => {
  let usersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        UserExceptionHandler,
        PassportModule
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