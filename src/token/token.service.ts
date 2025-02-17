import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TokenDto } from './dto/token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { TokenGenerator } from './interface/token-generator.interface';
import { Role } from '@src/common/code/enums/role.enum';

@Injectable()
export class TokenService<T extends TokenDto, R extends Promise<TokenResponseDto>> {
    private tokenGenerator: TokenGenerator<T, R>[];

    constructor(@Inject('TOKEN_GENERATORS') tokenGenerators: TokenGenerator<T, R>[]) {
        this.tokenGenerator = tokenGenerators;
    }

    issueToken(t: T, userRole: Role) {
        const tokenGenerator = this.findTokenGeneratorByTokenName(userRole);

        return tokenGenerator.issueToken(t);
    }

    private findTokenGeneratorByTokenName(userRole: Role) {
        const tokenGenerator = this.tokenGenerator.find(x => x.getUserRoleName() === userRole);
        if (!tokenGenerator) {
            throw new InternalServerErrorException(`Token generator for user type ${userRole} not found`);
        }
        return tokenGenerator;
    }
}
