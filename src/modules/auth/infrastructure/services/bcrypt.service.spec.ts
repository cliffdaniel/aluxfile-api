import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
    let bcryptService: BcryptService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BcryptService],
        }).compile();

        bcryptService = module.get<BcryptService>(BcryptService);
    });

    it('should hash a password correctly', async () => {
        const password = 'securePassword123';

        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');

        const result = await bcryptService.hashPassword(password);

        expect(result).toBe('hashed-password');

        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should compare passwords correctly and return true', async () => {
        const password = 'securePassword123';

        const hash = 'hashed-password';

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const result = await bcryptService.comparePasswords(password, hash);

        expect(result).toBe(true);

        expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should compare passwords correctly and return false for mismatched passwords', async () => {
        const password = 'securePassword123';

        const hash = 'hashed-password';

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        const result = await bcryptService.comparePasswords(password, hash);

        expect(result).toBe(false);

        expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });
});
