export class ErrorCode {
    private constructor(
        private readonly _code: string,
        private readonly _message: string
    ) {}

    static readonly NOT_FOUND_USER = new ErrorCode('USER_NOT_FOUND', '존재하지 않는 유저입니다.');
    static readonly NOT_FOUND_GYM = new ErrorCode('GYM_NOT_FOUND', '존재하지 않는 체육관입니다.');
    static readonly NOT_FOUND_MEMBER = new ErrorCode('MEMBER_NOT_FOUND', '존재하지 않는 회원입니다.');
    static readonly CONFLICT_PHONE = new ErrorCode('CONFLICT_PHONE', '이미 존재하는 전화번호입니다.');
    static readonly CONFLICT_EMAIL = new ErrorCode('CONFLICT_EMAIL', '이미 존재하는 이메일입니다.');
    static readonly BAD_REQUEST_INVALID_INPUT = new ErrorCode('INVALID_INPUT', '잘못된 입력값입니다.');
    static readonly UNAUTHORIZED = new ErrorCode('UNAUTHORIZED', '인증되지 않은 요청입니다.');
    static readonly FORBIDDEN = new ErrorCode('FORBIDDEN', '권한이 없습니다.');

    get code(): string {
        return this._code;
    }

    get message(): string {
        return this._message;
    }
}
