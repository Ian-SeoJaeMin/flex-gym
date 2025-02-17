import { Role } from '@src/common/code/enums/role.enum';
import { TokenResponseDto } from '../dto/token-response.dto';

export interface TokenGenerator<T, R extends Promise<TokenResponseDto>> {
    issueToken(t: T): R;
    getUserRoleName(): Role;
}
