import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { FlexGymException } from '../exception/flex-gym.exception';
import { ApiResponseDTO } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        console.error(exception);

        if (exception instanceof FlexGymException) {
            const errorResponse = ApiResponseDTO.error(exception.errorCode, exception.message);
            response.status(exception.statusCode).json(errorResponse);
        } else {
            const errorResponse = ApiResponseDTO.error('INTERNAL_SERVER_ERROR', '서버 내부 오류가 발생했습니다.');
            response.status(500).json(errorResponse);
        }
    }
}
