import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ForgotPasswordDto } from '../../application/dto/forgot-password.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'User successfully registered.' })
    @ApiResponse({ status: 409, description: 'Email already in use.' })
    async register(@Body() dto: RegisterDto) {
        return this.registerUseCase.execute(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() dto: LoginDto) {
        return this.loginUseCase.execute(dto);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Forgot password - Send reset email' })
    @ApiResponse({ status: 200, description: 'Reset email sent successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.forgotPasswordUseCase.execute(dto);
    }
}
