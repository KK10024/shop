import Redis from 'ioredis';

export class RedisUtil {
  private static redis: Redis;

  private static getRedisClient(): Redis {
    if (!this.redis) {
      this.redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
      });
    }
    return this.redis;
  }

  // 인증 코드 저장 (10분 유효)
  static async setVerificationCode(email: string, code: string): Promise<void> {
    await this.getRedisClient().setex(`verification:${email}`, 600, code);
  }

  // 인증 코드 조회
  static async getVerificationCode(email: string): Promise<string | null> {
    return await this.getRedisClient().get(`verification:${email}`);
  }

  // 인증 코드 삭제
  static async deleteVerificationCode(email: string): Promise<void> {
    await this.getRedisClient().del(`verification:${email}`);
  }
}