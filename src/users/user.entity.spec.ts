import { User } from './user.entity';
import { UserRoles } from './userRoles.enum';
import * as bcrypt from "bcrypt";

describe('UsersEntity', () => {
  let user : User;

  beforeEach(()=>{
    user = new User();
    user.id = 1;
    user.username = "TestUsername";
    user.password = "TestPassword";
    user.salt = "TestSalt";
    user.role = UserRoles.USER;
    bcrypt.hash = jest.fn();
  })

  describe("validatePassword", ()=>{
    it("return true if password is right", async()=>{
        bcrypt.hash.mockReturnValue("TestPassword");
        expect(bcrypt.hash).not.toHaveBeenCalled();
        const result = user.validatePassword("pass");
        expect(bcrypt.hash).toHaveBeenCalledWith("pass", "TestSalt");
        expect(result).resolves.toEqual(true);
    })
    it("return false if password is wrong", async()=>{
        bcrypt.hash.mockReturnValue("wrongPassword");
        expect(bcrypt.hash).not.toHaveBeenCalled();
        const result = user.validatePassword("pass1");
        expect(bcrypt.hash).toHaveBeenCalledWith("pass1", "TestSalt");
        expect(result).resolves.toEqual(false);
    })
  })
});