import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, VerifyemailDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response as ExpressResponse } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('email-code')
  @ApiOperation({ summary: '이메일 인증 코드를 요청합니다.' })  // 엔드포인트 설명
  @ApiBody({ type: VerifyemailDto })  // 요청 본문 설명
  @ApiResponse({ status: 200, description: '이메일 인증 코드가 전송되었습니다.' })  // 성공 응답 설명
  @ApiResponse({ status: 400, description: '잘못된 이메일 요청입니다.' })  // 실패 응답 설명
  async emailCode(@Body() varifyemailDto: VerifyemailDto) {
    return await this.userService.emailCode(varifyemailDto);
  }

  @Post('sign-up')
  @ApiOperation({ summary: '새로운 사용자 회원가입을 합니다.' })  // 엔드포인트 설명
  @ApiBody({ type: CreateUserDto })  // 요청 본문 설명
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 등록되었습니다.' })  // 성공 응답 설명
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })  // 실패 응답 설명
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: '사용자 로그인' })  // 엔드포인트 설명
  @ApiBody({ type: LoginUserDto })  // 요청 본문 설명
  @ApiResponse({ status: 200, description: '로그인 성공' })  // 성공 응답 설명
  @ApiResponse({ status: 401, description: '로그인 정보가 잘못되었습니다.' })  // 실패 응답 설명
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: ExpressResponse) {
    const token = await this.userService.login(loginUserDto);
    res.cookie('token', token, {
      httpOnly: true, // 클라이언트 JavaScript에서 접근 불가
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키를 전송
      maxAge: 3600000, // 만료 시간 (1시간)
    });

    return res.json({ message: '로그인성공' });
  }
}
