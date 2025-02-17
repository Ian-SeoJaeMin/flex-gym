import { BadRequestException } from '@nestjs/common';

export function parseBasicToken(rawToken: string) {
    const tokenSplit = rawToken.split(' ');
    if (tokenSplit.length !== 2) throw new BadRequestException('토큰 포맷이 잘못되었습니다.');

    const [, token] = tokenSplit;

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const split = decoded.split(':');
    if (split.length !== 2) throw new BadRequestException('토큰 포맷이 잘못되었습니다.');
    const [email, password] = split;
    return { email, password };
}
