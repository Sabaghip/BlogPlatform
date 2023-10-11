import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './users.repository';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { User } from './user.entity';

const mockCreditionDto = {username : "TestUsername", password : "TestPassword"};

describe('UsersRepository', () => {
  let usersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        PassportModule
      ],
    }).compile();

    usersRepository = await module.get<UserRepository>(UserRepository);
  });

  describe("signIn", ()=>{
    it("sign in successfuly", ()=>{
      let user = new User;
      usersRepository.findOne = jest.fn().mockResolvedValue(user)
      expect(usersRepository.signIn(mockCreditionDto)).resolves.toEqual(user);
    })

    it("sign in not successfuly", ()=>{
      usersRepository.findOne = jest.fn().mockResolvedValue(BadRequestException)
      expect(usersRepository.signIn(mockCreditionDto)).toThrow();
    })
  })
});