import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './code/error-code.enum';
import { FlexGymException } from './flex-gym.exception';

export class ConflictUserException extends FlexGymException {
    constructor(phone?: string, email?: string) {
        if (phone) {
            super(`${ErrorCode.CONFLICT_PHONE.message} [${phone}]`, HttpStatus.CONFLICT, ErrorCode.CONFLICT_PHONE.code);
        } else if (email) {
            super(ErrorCode.CONFLICT_EMAIL.message, HttpStatus.CONFLICT, ErrorCode.CONFLICT_EMAIL.code);
        }
    }
}
