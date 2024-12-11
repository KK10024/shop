import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, VerifyemailDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; 
import { LoginUserDto } from './dto/login-user.dto';
import { EmailUtil } from 'src/utils/email.util';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomLoggerService } from 'src/common/custom-logger/logger.service';
import { CreateUser } from './type/create-user.type';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly logger: CustomLoggerService,
  ){}

  async emailCode(verifyemailDto: VerifyemailDto) {
    this.logger.log('이메일 코드 서비스 호출');

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
    this.logger.log('회원가입 서비스 호출');

    const { email, name, password, code } = createUserDto;

    const savedCode = await this.cacheManager.get(`verification:${email}`);
    if (savedCode !== code) throw new BadRequestException('인증 코드가 유효하지않거나, 일치하지 않습니다.');
    
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
    return { message: "회원가입완료" };
  }
  async login(loginDTO : LoginUserDto){
    this.logger.log('로그인 서비스 호출');

    const { email , password} = loginDTO;
    const user = await this.userRepository.findByEmail(email);

    if(!user) throw new BadRequestException("존재하지않은 유저");

    const pwchk = await bcrypt.compare(password, user.password);
    if(!pwchk) throw new BadRequestException("패스워드가 일치하지않음");

    const payload = { email: user.email, uuid: user.uuid , roles: user.role };
    const token = this.jwtService.sign(payload);
    return token;
  }
  async findOneUser(userId: string){
    const user = await this.userRepository.findOne(userId);
    if(!user) throw new NotFoundException('유저를 찾을 수 없습니다'); 
    return user;
  }
}