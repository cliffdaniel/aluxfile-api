import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { TokenPayload } from '../../domain/interfaces/token-payload.interface';

@Injectable()
export class JwtService {
    private readonly secret = process.env.JWT_SECRET || 'default_secret';
    private readonly expiresIn = '1h';

    generateToken(userId: string, email: string): string {
        return jwt.sign({ userId, email }, this.secret, {
            expiresIn: this.expiresIn,
        });
    }

    verifyToken(token: string): TokenPayload {
        return jwt.verify(token, this.secret) as TokenPayload;
    }
}
