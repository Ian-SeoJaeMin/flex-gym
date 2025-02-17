import { BadRequestException, createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { parseBasicToken } from 'src/common/utility/token-parser';

export const Authorization = createParamDecorator((data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const rawToken: string = req.headers['authorization'];
    if (!rawToken) throw new UnauthorizedException('토큰 정보가 없습니다.');

    if (!/^basic|bearer/i.test(rawToken)) throw new BadRequestException('토큰 포맷이 잘못되었습니다.');
    if (rawToken.startsWith('Basic')) return parseBasicToken(rawToken);
    // if (rawToken.startsWith('Bearer')) return parseBearerToken(rawToken);
});
