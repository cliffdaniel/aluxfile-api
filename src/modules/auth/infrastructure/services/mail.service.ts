import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    async sendResetPasswordEmail(email: string, token: string) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: `"Support Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your Password',
            text: `Click here to reset your password: ${resetUrl}`,
            html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
        });
    }
}
