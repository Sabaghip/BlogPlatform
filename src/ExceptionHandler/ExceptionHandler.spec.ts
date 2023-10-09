import { BadRequestException} from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { SignUpOrSignInDto } from "../users/dto/signUpOrSignIn.dto";
import { UserRoles } from "../users/userRoles.enum";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";
import { UserExceptionHandler } from "./ExceptionHandler";
import { UserRepository } from "../users/user.repository";
import { JwtService } from "@nestjs/jwt";

describe('ExceptionHandler', () => {
  let user : User;
  let userService : UsersService;
  let signUpDto : SignUpOrSignInDto;
  let logger: Logger;

  beforeEach(async ()=>{
    user = new User();
    user.id = 1;
    user.username = "TestUsername";
    user.password = "TestPassword";
    user.salt = "TestSalt";
    user.role = UserRoles.USER;
    bcrypt.hash = jest.fn();

    signUpDto = new SignUpOrSignInDto;
    signUpDto.password = "TestPassword"
    signUpDto.username = "TestUsername"

    logger = new Logger();

    const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          UserRepository,
          JwtService
        ],
      }).compile();

      userService = module.get<UsersService>(UsersService);
  })

  describe("signUpExceptionHandler", ()=>{
    it("sign up successfully", async()=>{
        userService.signUp = jest.fn().mockReturnValue(Promise<void>)
        expect(UserExceptionHandler.signUpExceptionHandler(userService, signUpDto, logger)).toEqual(Promise<void>);
    })
    it("sign up not successfully", async()=>{
        userService.signUp = jest.fn().mockReturnValue(BadRequestException)
        expect(UserExceptionHandler.signUpExceptionHandler(userService, {password : "wrongpassword", username : "username"}, logger)).toThrow();
    })
  })
});