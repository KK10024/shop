import { BadGatewayException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export class EmailUtil {
  private static transporter: nodemailer.Transporter;

  private static getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com', // SMTP 서버 호스트
          port: 587,              // SMTP 서버 포트 (보통 587)
          secure: false,          // 보안을 활성화 (TLS)
        auth: {
          user: "rlwmsdl12@gmail.com",
          pass: "jyxd koai gytp pmdx",
      },
      });
    }
    return this.transporter;
  }

  static async sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: 'rlwmsdl12@gmail.com',
      to: email,
      subject: '이메일 인증 코드 입니다.',
      text: `인증 코드는 ${code}입니다.`,
    };

    try {
      await this.getTransporter().sendMail(mailOptions);
    } catch (e) {
      console.error('Email send error:', e);
      throw new BadGatewayException('이메일 전송에 실패했습니다.', e);
    }
  }
}