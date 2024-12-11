import { CreateUserDto, VerifyemailDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { User } from "../entities/user.entity";

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<{ message: string }>;
  login(loginDto: LoginUserDto): Promise<string>;
  emailCode(verifyemailDto: VerifyemailDto): Promise<{ message: string }>;
  findOneUser(userId: string): Promise<User>;
}