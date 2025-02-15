import { Module } from '@nestjs/common';

import { ForgotPasswordUseCase } from './application/use-cases/forgot-password.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { BcryptService } from './infrastructure/services/bcrypt.service';
import { JwtService } from './infrastructure/services/jwt.service';
import { MailService } from './infrastructure/services/mail.service';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [
        RegisterUseCase,
        LoginUseCase,
        ForgotPasswordUseCase,
        BcryptService,
        JwtService,
        MailService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [RegisterUseCase, LoginUseCase, ForgotPasswordUseCase],
})
export class AuthModule {}
