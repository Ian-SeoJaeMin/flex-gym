import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './code/error-code.enum';
import { FlexGymException } from './flex-gym.exception';

export class NotFoundUserException extends FlexGymException {
    constructor(userId?: string) {
        if (userId) {
            super(`${ErrorCode.NOT_FOUND_USER.message} [${userId}]`, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND_USER.code);
        } else {
            super(ErrorCode.NOT_FOUND_USER.message, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND_USER.code);
        }
    }
}
