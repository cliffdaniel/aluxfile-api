import { BadRequestException } from '@nestjs/common';

export class EmailValue {
    private readonly email: string;

    constructor(email: string) {
        if (!this.isValidEmail(email)) {
            throw new BadRequestException('Invalid email format');
        }

        this.email = email;
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    get value(): string {
        return this.email;
    }
}
