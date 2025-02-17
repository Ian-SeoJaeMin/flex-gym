import { Role } from '@src/common/code/enums/role.enum';
import { BaseTable } from '@src/common/entity/base-table.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseTable {
    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({
        toPlainOnly: true
    })
    password: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @Column({ nullable: true })
    centerId: string;

    // @ManyToOne(() => Center, center => center.users)
    // center: Center;
}
