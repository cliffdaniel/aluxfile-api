import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFileDto {
    @ApiProperty({
        example: 'old-file-key.jpg',
        description: 'Current file key in S3',
    })
    @IsString()
    @IsNotEmpty()
    oldFileKey: string;

    @ApiProperty({ example: 'new-file-name.jpg', description: 'New file name' })
    @IsString()
    @IsNotEmpty()
    newFileName: string;
}
