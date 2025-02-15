import { Test, TestingModule } from '@nestjs/testing';

import { RegisterUseCase } from './register.use-case';
import { ConflictException } from '../../../../shared/exceptions/conflict.exception';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BcryptService } from '../../infrastructure/services/bcrypt.service';

const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
};

const mockBcryptService = {
    hashPassword: jest.fn().mockResolvedValue('hashed-password'),
};

describe('RegisterUseCase', () => {
    let registerUseCase: RegisterUseCase;

    let _userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterUseCase,
                { provide: UserRepository, useValue: mockUserRepository },
                { provide: BcryptService, useValue: mockBcryptService },
            ],
        }).compile();

        registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);

        _userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should register a new user successfully', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        mockUserRepository.create.mockResolvedValue({
            id: 'uuid-123',
            email: 'user@example.com',
            password: 'hashed-password',
        });

        const result = await registerUseCase.execute({
            email: 'user@example.com',
            password: 'password123',
        });

        expect(result).toEqual({
            id: 'uuid-123',
            email: 'user@example.com',
            password: 'hashed-password',
        });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            'user@example.com',
        );

        expect(mockBcryptService.hashPassword).toHaveBeenCalledWith(
            'password123',
        );

        expect(mockUserRepository.create).toHaveBeenCalledWith(
            'user@example.com',
            'hashed-password',
        );
    });

    it('should throw ConflictException when email is already in use', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
            id: 'uuid-123',
            email: 'user@example.com',
            password: 'hashed-password',
        });

        await expect(
            registerUseCase.execute({
                email: 'user@example.com',
                password: 'password123',
            }),
        ).rejects.toThrow(ConflictException);
    });
});
