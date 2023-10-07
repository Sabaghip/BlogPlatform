import { Body, Controller, Delete, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { GetUser } from '../post/decorators/getUser.decorator';
import { User } from '../users/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comment')
@UseGuards(AuthGuard())
export class CommentController {
    private logger = new Logger("CommentController")
    constructor(
        private commentService : CommentService,
    ){}
    
    @Post("/:postid")
    createComment(
        @Body(ValidationPipe) createCommentDto : CreateCommentDto,
        @Param("postid", new ParseIntPipe) postid : number,
        @GetUser() user : User, 
        ){
            return CommentExceptionHandler.createCommentExceptionHandler(this.commentService, user, createCommentDto, postid, this.logger);
        }
    
    @Patch("/:id")
    editComment(
        @Param("id", new ParseIntPipe) id:number,
        @GetUser() user : User,
        @Body(ValidationPipe) createCommentDto : CreateCommentDto,
    ){
        return CommentExceptionHandler.editCommentExceptionHandler(this.commentService, user, id, createCommentDto, this.logger);
    }

    @Delete("/:id")
    deleteComment(
        @Param("id", ParseIntPipe) id : number,
        @GetUser() user : User,
        ){
            return CommentExceptionHandler.deleteCommentExceptionHandler(this.commentService, user, id, this.logger);
    }
}
