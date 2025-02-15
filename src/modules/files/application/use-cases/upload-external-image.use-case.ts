import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

import { S3Service } from '../../infrastructure/services/s3.service';

@Injectable()
export class UploadExternalImageUseCase {
    constructor(private readonly s3Service: S3Service) {}

    /**
     * Downloads an image from an external URL and uploads it to AWS S3.
     *
     * - Fetches the image as a binary buffer.
     * - Converts the binary data into a `Buffer`.
     * - Uploads the image to AWS S3.
     *
     * @param {string} imageUrl - The URL of the image to be downloaded.
     * @returns {Promise<string>} The S3 URL of the uploaded image.
     * @throws {BadRequestException} If the image cannot be downloaded or uploaded.
     */
    async execute(imageUrl: string): Promise<string> {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
            });

            if (!response.data) {
                throw new BadRequestException('Could not download image');
            }

            const buffer = globalThis.Buffer.from(response.data, 'binary');

            return await this.s3Service.uploadBuffer(
                buffer,
                `external-${Date.now()}.jpg`,
            );
        } catch {
            throw new BadRequestException(
                'Error fetching image from external source',
            );
        }
    }
}
