import { Module } from '@nestjs/common';

import { FileController } from './controllers/file.controller';
import { S3Service } from './services/s3.service';
import { UnsplashService } from './services/unsplash.service';
import { GetFileUrlUseCase } from '../application/use-cases/get-file-url.use-case';
import { RenameFileUseCase } from '../application/use-cases/rename-file.use-case';
import { SearchImageUseCase } from '../application/use-cases/search-image.use-case';
import { UploadExternalImageUseCase } from '../application/use-cases/upload-external-image.use-case';
import { UploadFileUseCase } from '../application/use-cases/upload-file.use-case';

@Module({
    controllers: [FileController],
    providers: [
        UploadFileUseCase,
        GetFileUrlUseCase,
        UploadExternalImageUseCase,
        RenameFileUseCase,
        S3Service,
        UnsplashService,
        SearchImageUseCase,
    ],
    exports: [
        UploadFileUseCase,
        UploadExternalImageUseCase,
        GetFileUrlUseCase,
        RenameFileUseCase,
        SearchImageUseCase,
    ],
})
export class FilesModule {}
