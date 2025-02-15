import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { EmailValue } from '../../../../shared/domain/values/email.value';
import { UserRepository } from '../../domain/repositories/user.repository';
import { MailService } from '../../infrastructure/services/mail.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly mailService: MailService,
    ) {}

    /**
     * Executes the forgot password process.
     *
     * - Validates the email format.
     * - Checks if the user exists in the system.
     * - Generates a password reset token.
     * - Stores the reset token in the database.
     * - Sends a password reset email to the user.
     *
     * @param {ForgotPasswordDto} dto - The forgot password request data.
     * @throws {NotFoundException} If the user is not found.
     * @returns {Promise<{ message: string }>} A confirmation message.
     */
    async execute(dto: ForgotPasswordDto) {
        const email = new EmailValue(dto.email).value;

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const resetToken = uuidv4();

        await this.userRepository.updateResetToken(user.id, resetToken);

        await this.mailService.sendResetPasswordEmail(user.email, resetToken);

        return { message: 'Password reset email sent' };
    }
}
