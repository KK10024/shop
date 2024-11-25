import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params } = req;
    const now = Date.now();

    this.logger.log(
      `Incoming Request - Method: ${method}, URL: ${originalUrl}, Query: ${JSON.stringify(
        query,
      )}, Params: ${JSON.stringify(params)}, Body: ${JSON.stringify(body)}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `Outgoing Response - Method: ${method}, URL: ${originalUrl}, Status: ${statusCode}, Time: ${
          Date.now() - now
        }ms`,
      );
    });

    next();
  }
}