import { Body, Controller, Delete, InternalServerErrorException, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/post/dto/getUser.decorator';
import { User } from 'src/users/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comment')
@UseGuards(AuthGuard())
export class CommentController {
    private logger = new Logger("CommentController")
    constructor(
        private commentService : CommentService,
    ){}
    
    @Post("/:postid/createComment")
    createComment(
        @Body(ValidationPipe) createCommentDto : CreateCommentDto,
        @Param("postid", new ParseIntPipe) postid : number,
        @GetUser() user : User, 
        ){
            this.logger.verbose(`"${user.username}" trying to create a comment.`)
            let result;
            try{
                result = this.commentService.createComment(createCommentDto, postid, user);
                return result;
            }catch(err){
                this.logger.error(`Failed to create comment.`, err.stack)
                throw new InternalServerErrorException()
            }
        }
    
    @Patch("/:id/editComment")
    editComment(
        @Param("id", new ParseIntPipe) id:number,
        @GetUser() user : User,
        @Body(ValidationPipe) createCommentDto : CreateCommentDto,
    ){
        this.logger.verbose(`"${user.username}" trying to edit a comment.`)
            let result;
            try{
                result = this.commentService.editComment(id,  createCommentDto ,user);
                return result;
            }catch(err){
                this.logger.error(`Failed to edit comment.`, err.stack)
                throw new InternalServerErrorException()
            }
    }

    @Delete("/:id/deleteComment")
    deleteComment(
        @Param("id", ParseIntPipe) id : number,
        @GetUser() user : User,
        ){
            this.logger.verbose(`"${user.username}" trying to delete a comment.`)
            let result;
            try{
                result = this.commentService.deleteComment(id, user);
                return result;
            }catch(err){
                this.logger.error(`Failed to delete comment.`, err.stack)
                throw new InternalServerErrorException()
            }
    }
}
