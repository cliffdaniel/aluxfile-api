import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';

import { MailService } from './mail.service';

jest.mock('nodemailer');

const mockSendMail = jest.fn();

const mockTransporter = {
    sendMail: mockSendMail,
};

(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

describe('MailService', () => {
    let mailService: MailService;

    beforeEach(async () => {
        process.env.EMAIL_USER = 'test@example.com';

        process.env.EMAIL_PASS = 'test-password';

        process.env.FRONTEND_URL = 'http://localhost:3000';

        const module: TestingModule = await Test.createTestingModule({
            providers: [MailService],
        }).compile();

        mailService = module.get<MailService>(MailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send reset password email successfully', async () => {
        mockSendMail.mockResolvedValueOnce(true);

        const email = 'user@example.com';

        const token = 'reset-token-123';

        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

        await mailService.sendResetPasswordEmail(email, token);

        expect(mockSendMail).toHaveBeenCalledWith({
            from: `"Support Team" <test@example.com>`,
            to: email,
            subject: 'Reset Your Password',
            text: `Click here to reset your password: ${resetUrl}`,
            html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
        });
    });

    it('should throw an error if email sending fails', async () => {
        mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

        const email = 'user@example.com';

        const token = 'reset-token-123';

        await expect(
            mailService.sendResetPasswordEmail(email, token),
        ).rejects.toThrow('SMTP error');
    });
});
