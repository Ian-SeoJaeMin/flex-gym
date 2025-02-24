import { Role } from '@src/common/code/enums/role.enum';
import { TokenDto } from './token.dto';

export class UserTokenDto extends TokenDto {
    role: Role;
}
