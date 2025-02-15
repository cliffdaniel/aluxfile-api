import { Test, TestingModule } from '@nestjs/testing';

import { GetFileUrlUseCase } from './get-file-url.use-case';
import { S3Service } from '../../infrastructure/services/s3.service';

const mockS3Service = {
    getFileUrl: jest.fn(),
};

describe('GetFileUrlUseCase', () => {
    let getFileUrlUseCase: GetFileUrlUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetFileUrlUseCase,
                { provide: S3Service, useValue: mockS3Service },
            ],
        }).compile();

        getFileUrlUseCase = module.get<GetFileUrlUseCase>(GetFileUrlUseCase);
    });

    it('should return the file URL from S3', async () => {
        const fileKey = 'example-file.jpg';

        const fileUrl = `https://s3.amazonaws.com/bucket/${fileKey}`;

        mockS3Service.getFileUrl.mockReturnValue(fileUrl);

        const result = await getFileUrlUseCase.execute(fileKey);

        expect(result).toEqual({ url: fileUrl });

        expect(mockS3Service.getFileUrl).toHaveBeenCalledWith(fileKey);
    });
});
