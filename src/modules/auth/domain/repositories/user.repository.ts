import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract create(email: string, password: string): Promise<UserEntity>;
    abstract updateResetToken(
        userId: string,
        resetToken: string,
    ): Promise<void>;
}
