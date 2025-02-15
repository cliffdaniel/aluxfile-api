import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import 'multer';

@Injectable()
export class S3Service {
    private s3: AWS.S3;
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME || '';

        if (!this.bucketName) {
            throw new InternalServerErrorException(
                'AWS_BUCKET_NAME is not defined in environment variables',
            );
        }

        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileKey = `${uuidv4()}-${file.originalname}`;

        await this.s3
            .upload({
                Bucket: this.bucketName,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'bucket-owner-full-control',
            })
            .promise();

        return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    }

    async uploadBuffer(
        buffer: globalThis.Buffer,
        fileName: string,
    ): Promise<string> {
        const fileKey = `${uuidv4()}-${fileName}`;

        await this.s3
            .upload({
                Bucket: this.bucketName,
                Key: fileKey,
                Body: buffer,
                ContentType: 'image/jpeg',
                ACL: 'bucket-owner-full-control',
            })
            .promise();

        return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    }

    getFileUrl(fileKey: string): string {
        return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    }

    async getFileStream(fileKey: string): Promise<AWS.S3.GetObjectOutput> {
        try {
            const params = { Bucket: this.bucketName, Key: fileKey };

            return await this.s3.getObject(params).promise();
        } catch {
            throw new NotFoundException('File not found on S3');
        }
    }

    async renameFile(oldFileKey: string, newFileName: string): Promise<string> {
        const newFileKey = `${uuidv4()}-${newFileName}`;

        try {
            await this.s3
                .copyObject({
                    Bucket: this.bucketName,
                    CopySource: `${this.bucketName}/${oldFileKey}`,
                    Key: newFileKey,
                })
                .promise();

            await this.s3
                .deleteObject({
                    Bucket: this.bucketName,
                    Key: oldFileKey,
                })
                .promise();

            return newFileKey;
        } catch {
            throw new NotFoundException(
                'File not found or could not be renamed',
            );
        }
    }
}
