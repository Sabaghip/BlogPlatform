import { HttpStatus, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionWithData } from "./Exceptions";

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
    logger : Logger = new Logger("UsersRepository");
    catch(exception: unknown, host: ArgumentsHost) {
        if(exception instanceof InternalServerErrorException){
            this.logger.error(exception.message, exception.stack)
        }
        else if(exception instanceof HttpExceptionWithData){
            if(exception.logger){
                exception.logger.verbose(exception.data)
            }
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