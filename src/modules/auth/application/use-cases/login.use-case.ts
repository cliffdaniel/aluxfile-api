import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

import { EmailValue } from '../../../../shared/domain/values/email.value';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BcryptService } from '../../infrastructure/services/bcrypt.service';
import { JwtService } from '../../infrastructure/services/jwt.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Executes the user login process.
     *
     * - Validates the email format.
     * - Finds the user by email in the database.
     * - Compares the provided password with the stored hash.
     * - Generates a JWT access token upon successful authentication.
     *
     * @param {LoginDto} dto - The login request data.
     * @throws {UnauthorizedException} If the credentials are invalid.
     * @returns {Promise<{ accessToken: string }>} A JWT access token.
     */
    async execute(dto: LoginDto): Promise<{ accessToken: string }> {
        const email = new EmailValue(dto.email).value;

        const user = await this.userRepository.findByEmail(email);

        if (
            !user ||
            !(await this.bcryptService.comparePasswords(
                dto.password,
                user.password,
            ))
        ) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.jwtService.generateToken(user.id, user.email);

        return { accessToken };
    }
}
