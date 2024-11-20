import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, VerifyemailDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; 
import { LoginUserDto } from './dto/login-user.dto';
import { RedisUtil } from 'src/utils/redis.util';
import { EmailUtil } from 'src/utils/email.util';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateUser } from './interface/create-Interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ){}

  async emailCode(verifyemailDto: VerifyemailDto) {
    const { email } = verifyemailDto;

    const userchk = await this.userRepository.findByEmail(email)
    if(userchk) throw new BadRequestException('이미 가입된 유저 입니다');

    const existingCode = await this.cacheManager.get(`verification:${email}`);
  
    if (existingCode) throw new BadRequestException('이미 인증 코드가 발송되었습니다.');
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
  
    await this.cacheManager.set(`verification:${email}`, code); 
    
    await EmailUtil.sendVerificationEmail(email, code);
    
    return { message: '인증 코드가 이메일로 전송되었습니다.' };
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password, code } = createUserDto;
    const savedCode = await this.cacheManager.get(`verification:${email}`);

    if (!savedCode) throw new BadRequestException('유효한 인증 코드가 아닙니다.');

    if (savedCode !== code) throw new BadRequestException('인증 코드가 일치하지 않습니다.');

    await this.cacheManager.del(`verification:${email}`);
    const user = await this.userRepository.findByEmail(email);
    if(user) throw new BadRequestException("이미 가입된 이메일 입니다.");

    const hashedPassword = await bcrypt.hash(password, 10);
  
    const createUser: CreateUser = {
      email,
      name,
      password: hashedPassword,
    };    
    const saveUser = await this.userRepository.createUser(createUser)
    return {messsage: "회원가입완료"};
  }
  async login(loginDTO : LoginUserDto){
    const { email , password} = loginDTO;
    const user = await this.userRepository.findByEmail(email);

    if(!user) throw new BadRequestException("존재하지않은 유저");

    const pwchk = await bcrypt.compare(password, user.password);
    if(!pwchk) throw new BadRequestException("패스워드가 일치하지않음");

    const payload = { email: user.email, uuid: user.uuid };
    const token = this.jwtService.sign(payload);
    return token;
  }
}