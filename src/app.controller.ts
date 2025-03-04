import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('health')
    healthChecker(): string {
        return 'OK';
    }
}
