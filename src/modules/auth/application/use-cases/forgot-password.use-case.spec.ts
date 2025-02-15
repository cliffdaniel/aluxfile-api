import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { MailService } from '../../infrastructure/services/mail.service';

const mockUserRepository = {
    findByEmail: jest.fn(),
    updateResetToken: jest.fn(),
};

const mockMailService = {
    sendResetPasswordEmail: jest.fn(),
};

describe('ForgotPasswordUseCase', () => {
    let forgotPasswordUseCase: ForgotPasswordUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ForgotPasswordUseCase,
                { provide: UserRepository, useValue: mockUserRepository },
                { provide: MailService, useValue: mockMailService },
            ],
        }).compile();

        forgotPasswordUseCase = module.get<ForgotPasswordUseCase>(
            ForgotPasswordUseCase,
        );
    });

    it('should generate a reset token and send an email if user exists', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
            id: 'uuid-123',
            email: 'user@example.com',
        });

        await forgotPasswordUseCase.execute({ email: 'user@example.com' });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            'user@example.com',
        );

        expect(mockUserRepository.updateResetToken).toHaveBeenCalled();

        expect(mockMailService.sendResetPasswordEmail).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(
            forgotPasswordUseCase.execute({ email: 'nonexistent@example.com' }),
        ).rejects.toThrow(NotFoundException);
    });
});
