import { HttpStatus, InternalServerErrorException, Logger } from "@nestjs/common";
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
    logger : Logger = new Logger("UsersRepository");
    catch(exception: unknown, host: ArgumentsHost) {
        if(exception instanceof InternalServerErrorException){
            this.logger.error(exception.message, exception.stack)
        }
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const httpStatus =
            exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: request.url,
        };
        const message =
        exception instanceof HttpException
            ? exception.message
            : "internal server error.";
        response
        .status(httpStatus)
        .json({
            statusCode: httpStatus,
            message : message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}