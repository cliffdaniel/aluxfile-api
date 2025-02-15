import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchImageDto {
    @ApiProperty({
        example: 'mountains',
        description: 'Search query for images',
    })
    @IsString()
    @IsNotEmpty()
    query: string;
}
