import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        return user
            ? new UserEntity(user.id, user.email, user.password, user.createdAt)
            : null;
    }

    async create(email: string, password: string): Promise<UserEntity> {
        const user = await this.prisma.user.create({
            data: { email, password },
        });

        return new UserEntity(
            user.id,
            user.email,
            user.password,
            user.createdAt,
        );
    }

    async updateResetToken(userId: string, resetToken: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                resetToken,
                resetTokenExpiry: new Date(Date.now() + 3600000),
            },
        });
    }
}
