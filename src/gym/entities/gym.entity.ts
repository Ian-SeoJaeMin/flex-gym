import { BaseTable } from '@src/common/entity/base-table.entity';
import { Member } from '@src/member/entities/member.entity';
import { User } from '@src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Gym extends BaseTable {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    website: string;

    @Column({ length: 5 })
    postalCode: string;

    @Column({ length: 255 })
    roadAddress: string;

    @Column({ length: 255 })
    jibunAddress: string;

    @Column({ nullable: true, length: 255 })
    detailAddress: string;

    @Column({ length: 5 })
    openTime: string;

    @Column({ length: 5 })
    closeTime: string;

    @Column({ nullable: true, length: 500 })
    description: string;

    @ManyToOne(() => User, user => user.gyms, {
        cascade: true,
        nullable: false
    })
    @JoinColumn()
    owner: User;

    @OneToMany(() => Member, member => member.gym)
    members: Member[];
}
