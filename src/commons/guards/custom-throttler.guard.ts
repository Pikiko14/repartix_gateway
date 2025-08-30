import {
    ThrottlerGuard as BaseThrottlerGuard,
    ThrottlerException,
    ThrottlerRequest,
} from '@nestjs/throttler';
import { Response } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends BaseThrottlerGuard {
    async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
        try {
            return await super.handleRequest(requestProps);
        } catch (error) {
            if (error instanceof ThrottlerException) {
                const response = requestProps.context.switchToHttp().getResponse<Response>();
                response.status(429).json({
                    statusCode: 429,
                    message: 'You have exceeded the limit of requests per minute, to maintain the integrity of our app you have been blocked for a few minutes.',
                    error: 'Too Many Requests',
                });
            }
            throw error;
        }
    }
}
