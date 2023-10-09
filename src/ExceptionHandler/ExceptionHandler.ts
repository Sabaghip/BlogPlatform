import { BadRequestException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PostService } from "../post/post.service";
import { CreatePostDto } from "../post/dto/createPost.dto";
import { FilterOperator, paginate, PaginateQuery } from "nestjs-paginate";
import { Post } from "../post/post.entity";
import { UserRoles } from "../users/userRoles.enum";
import { CommentService } from "../comment/comment.service";
import { CreateCommentDto } from '../comment/dto/createComment.dto';
import { Comment } from "../comment/comment.entity";
import { Repository } from "typeorm";


export class CommentExceptionHandler {
    public static createCommentExceptionHandler(commentService : CommentService, user, createCommentDto : CreateCommentDto,postid , logger : Logger){
        logger.verbose(`"${user.username}" trying to create a comment.`)
        let result;
        try{
            result = commentService.createComment(createCommentDto, postid, user);
            return result;
        }catch(err){
            logger.error(`Failed to create comment.`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static deleteCommentExceptionHandler(commentService : CommentService, user, id, logger : Logger){
        logger.verbose(`"${user.username}" trying to delete a comment.`)
        let result;
        try{
            result = commentService.deleteComment(id, user);
            return result;
        }catch(err){
            logger.error(`Failed to delete comment.`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static editCommentExceptionHandler(commentService : CommentService, user, id, createCommentDto : CreateCommentDto, logger : Logger){
        logger.verbose(`"${user.username}" trying to edit a comment.`)
        let result;
        try{
            result = commentService.editComment(id,  createCommentDto ,user);
            return result;
        }catch(err){
            logger.error(`Failed to edit comment.`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async createCommentInRepositoryExceptionHandler(comment : Comment, logger : Logger){
        try {
            await comment.save();
            delete comment.author
            return comment;
        }catch(err){
            logger.error("Failed to add comment to repository", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async editCommentInRepositoryExceptionHandler(comment : Comment, logger : Logger){
        try{
            await comment.save();
            delete comment.author
            return comment;
        }catch(err){
            logger.error("Failed to edit a comment in repository.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async deleteCommentInRepositoryExceptionHandler(repository : Repository<Comment>, id, logger : Logger){
        try{
            await repository.delete({id})
        }catch(err){
            logger.error("Failed to delete a comment from repository.", err.stack)
            throw new InternalServerErrorException()
        }
    }
}

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
    logger : Logger = new Logger("UsersRepository");
    catch(exception: unknown, host: ArgumentsHost) {
        if(exception instanceof InternalServerErrorException){
            this.logger.error(exception.message, exception.stack)
        }
        else if(exception instanceof UnauthorizedException){
            this.logger.verbose(`Someone tried to sign in with invalid creditionals.`)
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