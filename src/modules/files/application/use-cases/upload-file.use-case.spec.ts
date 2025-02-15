import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';

import { UploadFileUseCase } from './upload-file.use-case';
import { FileRepository } from '../../domain/repositories/file.repository';
import { S3Service } from '../../infrastructure/services/s3.service';

import 'multer';

const mockFileRepository = {
    saveFile: jest.fn(),
};

const mockS3Service = {
    uploadFile: jest.fn().mockResolvedValue({
        url: 'https://s3.amazonaws.com/bucket/test-file.jpg',
    }),
};

describe('UploadFileUseCase', () => {
    let uploadFileUseCase: UploadFileUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UploadFileUseCase,
                { provide: FileRepository, useValue: mockFileRepository },
                { provide: S3Service, useValue: mockS3Service },
            ],
        }).compile();

        uploadFileUseCase = module.get<UploadFileUseCase>(UploadFileUseCase);
    });

    it('should upload a file to S3 and return its URL', async () => {
        const mockFile = {
            originalname: 'test.jpg',
            buffer: globalThis.Buffer.from('mock file content'),
            mimetype: 'image/jpeg',
        } as Express.Multer.File;

        mockS3Service.uploadFile.mockResolvedValueOnce(
            'https://s3.amazonaws.com/bucket/test-file.jpg',
        );

        const result = await uploadFileUseCase.execute(mockFile);

        expect(result).toStrictEqual(
            'https://s3.amazonaws.com/bucket/test-file.jpg',
        );
    });

    it('should throw an error if S3 upload fails', async () => {
        mockS3Service.uploadFile.mockRejectedValueOnce(
            new Error('S3 upload failed'),
        );

        const mockFile = {
            originalname: 'test.jpg',
            buffer: globalThis.Buffer.from('mock file content'),
            mimetype: 'image/jpeg',
        } as Express.Multer.File;

        await expect(uploadFileUseCase.execute(mockFile)).rejects.toThrow(
            'S3 upload failed',
        );
    });
});
