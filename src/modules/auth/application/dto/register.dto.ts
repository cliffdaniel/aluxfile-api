import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'User password' })
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
