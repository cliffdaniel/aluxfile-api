import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadExternalImageDto {
    @ApiProperty({
        example: 'https://source.unsplash.com/random',
        description: 'Image URL',
    })
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;
}
