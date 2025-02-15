import {
    Controller,
    Post,
    UploadedFile,
    Body,
    UseInterceptors,
    Get,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import 'multer';

import { RenameFileDto } from '../../application/dto/rename-file.dto';
import { UploadExternalImageDto } from '../../application/dto/upload-external-image.dto';
import { GetFileUrlUseCase } from '../../application/use-cases/get-file-url.use-case';
import { RenameFileUseCase } from '../../application/use-cases/rename-file.use-case';
import { SearchImageUseCase } from '../../application/use-cases/search-image.use-case';
import { UploadExternalImageUseCase } from '../../application/use-cases/upload-external-image.use-case';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';

@ApiTags('Files')
@Controller('files')
export class FileController {
    constructor(
        private readonly uploadFileUseCase: UploadFileUseCase,
        private readonly uploadExternalImageUseCase: UploadExternalImageUseCase,
        private readonly getFileUrlUseCase: GetFileUrlUseCase,
        private readonly renameFileUseCase: RenameFileUseCase,
        private readonly searchImageUseCase: SearchImageUseCase,
    ) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload a file to AWS S3' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadFileUseCase.execute(file);
    }

    @Post('upload-external')
    @ApiOperation({ summary: 'Upload an external image to AWS S3' })
    @ApiBody({ type: UploadExternalImageDto })
    @ApiResponse({
        status: 201,
        description: 'External image uploaded successfully.',
    })
    async uploadExternalImage(@Body() dto: UploadExternalImageDto) {
        return this.uploadExternalImageUseCase.execute(dto.imageUrl);
    }

    @Get('get-url')
    @ApiOperation({ summary: 'Get the URL of a file stored in AWS S3' })
    @ApiQuery({ name: 'fileKey', required: true, type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'File URL retrieved successfully.',
    })
    async getFileUrl(@Query('fileKey') fileKey: string) {
        return this.getFileUrlUseCase.execute(fileKey);
    }

    @Post('rename')
    @ApiOperation({ summary: 'Rename a file in AWS S3' })
    @ApiBody({ type: RenameFileDto })
    @ApiResponse({ status: 200, description: 'File renamed successfully.' })
    async renameFile(@Body() dto: RenameFileDto) {
        return this.renameFileUseCase.execute(dto.oldFileKey, dto.newFileName);
    }

    @Get('search-images')
    @ApiOperation({ summary: 'Search images from Unsplash' })
    @ApiQuery({ name: 'query', required: true, type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'Images retrieved successfully.',
        type: [String],
    })
    async searchImages(@Query('query') query: string) {
        return this.searchImageUseCase.execute(query);
    }
}
