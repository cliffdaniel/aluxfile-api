import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/infrastructure/files.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule, AuthModule, FilesModule],
})
export class AppModule {}
