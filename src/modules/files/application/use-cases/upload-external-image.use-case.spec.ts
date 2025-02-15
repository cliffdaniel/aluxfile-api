import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { UploadExternalImageUseCase } from './upload-external-image.use-case';
import { S3Service } from '../../infrastructure/services/s3.service';

jest.mock('axios');

const mockS3Service = {
    uploadBuffer: jest.fn(),
};

describe('UploadExternalImageUseCase', () => {
    let uploadExternalImageUseCase: UploadExternalImageUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UploadExternalImageUseCase,
                { provide: S3Service, useValue: mockS3Service },
            ],
        }).compile();

        uploadExternalImageUseCase = module.get<UploadExternalImageUseCase>(
            UploadExternalImageUseCase,
        );

        jest.clearAllMocks();
    });

    it('should upload an external image to S3 successfully', async () => {
        const mockImageUrl =
            'https://fastly.picsum.photos/id/419/500/300.jpg?hmac=nav6fNv5jNUzZZwMyUPGSGILObchi-eNRdPfQVbpkB0';

        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: globalThis.Buffer.from('mock image data', 'binary'),
        });

        mockS3Service.uploadBuffer.mockResolvedValueOnce(
            'https://s3.amazonaws.com/bucket/test-file.jpg',
        );

        const result = await uploadExternalImageUseCase.execute(mockImageUrl);

        expect(result).toBe('https://s3.amazonaws.com/bucket/test-file.jpg');

        expect(mockS3Service.uploadBuffer).toHaveBeenCalledWith(
            expect.any(globalThis.Buffer),
            expect.stringMatching(/^external-\d+\.jpg$/),
        );
    });

    it('should throw BadRequestException if fetching the image fails', async () => {
        const mockImageUrl = 'https://invalid-url.com/image.jpg';

        (axios.get as jest.Mock).mockRejectedValueOnce(
            new Error('Network error'),
        );

        await expect(
            uploadExternalImageUseCase.execute(mockImageUrl),
        ).rejects.toThrow(BadRequestException);

        expect(mockS3Service.uploadBuffer).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if the image cannot be downloaded', async () => {
        const mockImageUrl = 'https://invalid-image-url.com/non-existent.jpg';

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: null });

        await expect(
            uploadExternalImageUseCase.execute(mockImageUrl),
        ).rejects.toThrow(BadRequestException);

        expect(mockS3Service.uploadBuffer).not.toHaveBeenCalled();
    });
});
