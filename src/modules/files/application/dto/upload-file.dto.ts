import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Express } from 'express';
import 'multer';

export class UploadFileDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    file: Express.Multer.File;
}
