import { Injectable } from '@nestjs/common';

import { S3Service } from '../../infrastructure/services/s3.service';

@Injectable()
export class GetFileUrlUseCase {
    constructor(private readonly s3Service: S3Service) {}

    /**
     * Retrieves the public URL of a file stored in AWS S3.
     *
     * - Generates a direct URL for accessing the file.
     *
     * @param {string} fileKey - The unique identifier of the file in S3.
     * @returns {Promise<{ url: string }>} The public URL of the file.
     */
    async execute(fileKey: string): Promise<{ url: string }> {
        return { url: this.s3Service.getFileUrl(fileKey) };
    }
}
