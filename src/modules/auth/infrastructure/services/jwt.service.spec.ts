import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';

import { JwtService } from './jwt.service';
import { TokenPayload } from '../../domain/interfaces/token-payload.interface';

jest.mock('jsonwebtoken');

describe('JwtService', () => {
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtService],
        }).compile();

        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should generate a JWT token', () => {
        const mockToken = 'mocked-jwt-token';

        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        const result = jwtService.generateToken(
            'user-id-123',
            'user@example.com',
        );

        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: 'user-id-123', email: 'user@example.com' },
            expect.any(String),
            { expiresIn: expect.any(String) },
        );

        expect(result).toBe(mockToken);
    });

    it('should verify a valid JWT token', () => {
        const mockToken = 'mocked-jwt-token';

        const mockPayload: TokenPayload = {
            userId: 'user-id-123',
            email: 'user@example.com',
        };

        (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

        const result = jwtService.verifyToken(mockToken);

        expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));

        expect(result).toEqual(mockPayload);
    });

    it('should throw an error if JWT verification fails', () => {
        const mockToken = 'invalid-token';

        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        expect(() => jwtService.verifyToken(mockToken)).toThrow(
            'Invalid token',
        );
    });
});
