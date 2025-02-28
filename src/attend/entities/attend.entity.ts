import { BaseTable } from '@src/common/entity/base-table.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Member } from '@src/member/entities/member.entity';
import { Gym } from '@src/gym/entities/gym.entity';

@Entity()
export class Attend extends BaseTable {
    @ManyToOne(() => Member, member => member.attendances)
    member: Member;

    @ManyToOne(() => Gym, gym => gym.attendances)
    gym: Gym;
}
