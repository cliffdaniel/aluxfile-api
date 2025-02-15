import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { S3Service } from '../../infrastructure/services/s3.service';

@Injectable()
export class RenameFileUseCase {
    constructor(private readonly s3Service: S3Service) {}

    /**
     * Renames a file stored in AWS S3.
     *
     * - Moves the file to a new key with the specified name.
     * - If the operation fails, throws an `InternalServerErrorException`.
     *
     * @param {string} oldFileKey - The current unique identifier of the file in S3.
     * @param {string} newFileName - The new name for the file.
     * @returns {Promise<{ newUrl: string }>} The new URL of the renamed file.
     * @throws {InternalServerErrorException} If renaming the file fails.
     */
    async execute(
        oldFileKey: string,
        newFileName: string,
    ): Promise<{ newUrl: string }> {
        const newFileKey = await this.s3Service.renameFile(
            oldFileKey,
            newFileName,
        );

        if (!newFileKey) {
            throw new InternalServerErrorException('Error renaming file');
        }

        return { newUrl: this.s3Service.getFileUrl(newFileKey) };
    }
}
