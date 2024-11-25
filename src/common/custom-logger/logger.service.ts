import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {

    log(message: string) {
        this.writeLog('LOG', message);
    }

    error(message: string, trace: string) {
        this.writeLog('ERROR', `${message} - Trace: ${trace}`);
    }

    warn(message: string) {
        this.writeLog('WARN', message);
    }

    debug(message: string) {
        this.writeLog('DEBUG', message);
    }

    verbose(message: string) {
        this.writeLog('VERBOSE', message);
    }

    private writeLog(level: string, message: string) {
        const logMessage = `${new Date().toISOString()} [${level}] ${message}\n`;

        // 콘솔에 출력
        console.log(logMessage);
    }
}