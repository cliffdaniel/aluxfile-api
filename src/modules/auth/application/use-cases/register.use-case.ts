import { Injectable, Inject } from '@nestjs/common';

import { EmailValue } from '../../../../shared/domain/values/email.value';
import { ConflictException } from '../../../../shared/exceptions/conflict.exception';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BcryptService } from '../../infrastructure/services/bcrypt.service';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
    ) {}

    /**
     * Executes the user registration process.
     *
     * - Validates the email format.
     * - Checks if the email is already registered.
     * - Encrypts the user's password.
     * - Saves the new user in the database.
     *
     * @param {RegisterDto} dto - The registration request data.
     * @throws {ConflictException} If the email is already in use.
     * @returns {Promise<UserEntity>} The newly created user entity.
     */
    async execute(dto: RegisterDto) {
        const email = new EmailValue(dto.email).value;

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await this.bcryptService.hashPassword(
            dto.password,
        );

        return this.userRepository.create(email, hashedPassword);
    }
}
