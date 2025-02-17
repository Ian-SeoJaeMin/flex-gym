import { TokenType } from '@src/common/code/enums/token-type.enum';

export class TokenDto {
    userId: string;
    refreshHash: string;
    tokenType: TokenType;
    exp: number;
}
