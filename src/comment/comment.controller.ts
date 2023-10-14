import { Body, Controller, Delete, Logger, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
        @Body() createCommentDto : CreateCommentDto,
        @Param("postid", new ParseIntPipe) postid : number,
        @GetUser() user : User, 
        ){
            this.logger.verbose(`"${user.username}" trying to create a comment.`)
            return this.commentService.createComment(createCommentDto, postid, user);
        }
    
    @Patch("/:commentid")
    editComment(
        @Param("commentid", new ParseIntPipe) id:number,
        @GetUser() user : User,
        @Body() createCommentDto : CreateCommentDto,
    ){
        this.logger.verbose(`"${user.username}" trying to edit a comment.`)
        return this.commentService.editComment(id,  createCommentDto ,user);
        
    }

    @Delete("/:commentid")
    deleteComment(
        @Param("commentid", ParseIntPipe) id : number,
        @GetUser() user : User,
    ){
        this.logger.verbose(`"${user.username}" trying to delete a comment.`)
        return this.commentService.deleteComment(id, user);     
    }
}
