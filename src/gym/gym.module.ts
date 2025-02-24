import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './entities/gym.entity';
import { User } from '@src/user/entities/user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Gym, User])],
    controllers: [GymController],
    providers: [GymService]
})
export class GymModule {}
