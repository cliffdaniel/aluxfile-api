import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { RenameFileUseCase } from './rename-file.use-case';
import { S3Service } from '../../infrastructure/services/s3.service';

const mockS3Service = {
    renameFile: jest.fn(),
    getFileUrl: jest.fn(),
};

describe('RenameFileUseCase', () => {
    let renameFileUseCase: RenameFileUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RenameFileUseCase,
                { provide: S3Service, useValue: mockS3Service },
            ],
        }).compile();

        renameFileUseCase = module.get<RenameFileUseCase>(RenameFileUseCase);
    });

    it('should rename a file and return the new URL', async () => {
        const oldFileKey = 'old-file-key.jpg';

        const newFileName = 'new-file-name.jpg';

        const newFileKey = 'new-file-key.jpg';

        const newFileUrl = `https://s3.amazonaws.com/bucket/${newFileKey}`;

        mockS3Service.renameFile.mockResolvedValue(newFileKey);

        mockS3Service.getFileUrl.mockReturnValue(newFileUrl);

        const result = await renameFileUseCase.execute(oldFileKey, newFileName);

        expect(result).toEqual({ newUrl: newFileUrl });

        expect(mockS3Service.renameFile).toHaveBeenCalledWith(
            oldFileKey,
            newFileName,
        );

        expect(mockS3Service.getFileUrl).toHaveBeenCalledWith(newFileKey);
    });

    it('should throw InternalServerErrorException if renaming fails', async () => {
        const oldFileKey = 'old-file-key.jpg';

        const newFileName = 'new-file-name.jpg';

        mockS3Service.renameFile.mockResolvedValue(null);

        mockS3Service.getFileUrl.mockClear();

        await expect(
            renameFileUseCase.execute(oldFileKey, newFileName),
        ).rejects.toThrow(InternalServerErrorException);

        expect(mockS3Service.renameFile).toHaveBeenCalledWith(
            oldFileKey,
            newFileName,
        );

        expect(mockS3Service.getFileUrl).not.toHaveBeenCalled();
    });
});
