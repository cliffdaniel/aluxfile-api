import { Test, TestingModule } from '@nestjs/testing';

import { LoginUseCase } from './login.use-case';
import { UnauthorizedException } from '../../../../shared/exceptions/unauthorized.exception';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BcryptService } from '../../infrastructure/services/bcrypt.service';
import { JwtService } from '../../infrastructure/services/jwt.service';

const mockUserRepository = {
    findByEmail: jest.fn(),
};

const mockBcryptService = {
    comparePasswords: jest.fn(),
};

const mockJwtService = {
    generateToken: jest.fn().mockReturnValue('mocked-jwt-token'),
};

describe('LoginUseCase', () => {
    let loginUseCase: LoginUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginUseCase,
                { provide: UserRepository, useValue: mockUserRepository },
                { provide: BcryptService, useValue: mockBcryptService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    });

    it('should return JWT token when credentials are valid', async () => {
        const user = new UserEntity(
            'uuid-123',
            'user@example.com',
            'hashed-password',
            new Date(),
        );

        mockUserRepository.findByEmail.mockResolvedValue(user);

        mockBcryptService.comparePasswords.mockResolvedValue(true);

        const result = await loginUseCase.execute({
            email: 'user@example.com',
            password: 'password123',
        });

        expect(result).toEqual({ accessToken: 'mocked-jwt-token' });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            'user@example.com',
        );

        expect(mockBcryptService.comparePasswords).toHaveBeenCalledWith(
            'password123',
            'hashed-password',
        );

        expect(mockJwtService.generateToken).toHaveBeenCalledWith(
            'uuid-123',
            'user@example.com',
        );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(
            loginUseCase.execute({
                email: 'user@example.com',
                password: 'password123',
            }),
        ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
        const user = new UserEntity(
            'uuid-123',
            'user@example.com',
            'hashed-password',
            new Date(),
        );

        mockUserRepository.findByEmail.mockResolvedValue(user);

        mockBcryptService.comparePasswords.mockResolvedValue(false);

        await expect(
            loginUseCase.execute({
                email: 'user@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });
});
