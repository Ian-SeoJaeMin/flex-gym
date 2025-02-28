import { Gender } from '@src/common/code/enums/gender.enum';
import { BaseTable } from '@src/common/entity/base-table.entity';
import { Gym } from '@src/gym/entities/gym.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Attend } from '@src/attend/entities/attend.entity';

@Entity()
export class Member extends BaseTable {
    @Column()
    name: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    birthdate: Date;

    @Column({ nullable: true })
    gender: Gender;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;

    @Column({ nullable: true })
    memo: string;

    @Column()
    centerId: string;

    @ManyToOne(() => Gym, gym => gym.members)
    gym: Gym;

    @OneToMany(() => Attend, attend => attend.member)
    attendances: Attend[];
}
