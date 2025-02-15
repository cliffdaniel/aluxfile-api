import { Injectable } from '@nestjs/common';
import { Express } from 'express';

import { S3Service } from '../../infrastructure/services/s3.service';
import 'multer';

@Injectable()
export class UploadFileUseCase {
    constructor(private readonly s3Service: S3Service) {}

    /**
     * Uploads a file to AWS S3.
     *
     * - Receives a file from an HTTP request.
     * - Sends the file to the S3 service for storage.
     * - Returns the URL of the uploaded file.
     *
     * @param {Express.Multer.File} file - The file to be uploaded.
     * @returns {Promise<string>} The S3 URL of the uploaded file.
     * @throws {InternalServerErrorException} If the file upload fails.
     */
    async execute(file: Express.Multer.File): Promise<string> {
        return await this.s3Service.uploadFile(file);
    }
}
