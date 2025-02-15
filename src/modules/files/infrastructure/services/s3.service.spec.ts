import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as AWS from 'aws-sdk';

import { S3Service } from './s3.service';

jest.mock('aws-sdk');

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mock-uuid'),
}));

describe('S3Service', () => {
    let s3Service: S3Service;

    let mockS3Instance: jest.Mocked<AWS.S3>;

    beforeEach(async () => {
        process.env.AWS_BUCKET_NAME = 'test-bucket';

        process.env.AWS_ACCESS_KEY = 'test-access-key';

        process.env.AWS_SECRET_KEY = 'test-secret-key';

        process.env.AWS_REGION = 'test-region';

        mockS3Instance = {
            upload: jest.fn().mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({ Location: 'mock-url' }),
            })),
            getObject: jest.fn().mockImplementation((params) => {
                if (params.Key === 'non-existent-file.jpg') {
                    return {
                        promise: jest
                            .fn()
                            .mockRejectedValue(new Error('Not Found')),
                    } as unknown as AWS.Request<
                        AWS.S3.GetObjectOutput,
                        AWS.AWSError
                    >;
                }

                return {
                    promise: jest.fn().mockResolvedValue({
                        Body: globalThis.Buffer.from('mock file'),
                    }),
                } as unknown as AWS.Request<
                    AWS.S3.GetObjectOutput,
                    AWS.AWSError
                >;
            }),
            copyObject: jest.fn().mockImplementation((params) => {
                if (params.CopySource === 'test-bucket/old-file.jpg') {
                    return {
                        promise: jest
                            .fn()
                            .mockRejectedValue(new Error('File not found')),
                    } as unknown as AWS.Request<
                        AWS.S3.CopyObjectOutput,
                        AWS.AWSError
                    >;
                }

                return {
                    promise: jest.fn().mockResolvedValue({}),
                } as unknown as AWS.Request<
                    AWS.S3.CopyObjectOutput,
                    AWS.AWSError
                >;
            }),
            deleteObject: jest.fn().mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({}),
            })),
        } as unknown as jest.Mocked<AWS.S3>;

        (AWS.S3 as unknown as jest.Mock).mockImplementation(
            () => mockS3Instance,
        );

        const module: TestingModule = await Test.createTestingModule({
            providers: [S3Service],
        }).compile();

        s3Service = module.get<S3Service>(S3Service);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw NotFoundException if file is not found on S3', async () => {
        await expect(
            s3Service.getFileStream('non-existent-file.jpg'),
        ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if renaming fails', async () => {
        await expect(
            s3Service.renameFile('old-file.jpg', 'new-file.jpg'),
        ).rejects.toThrow(NotFoundException);
    });
});
