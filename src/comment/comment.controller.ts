import { Body, Controller, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/post/dto/getUser.decorator';
import { User } from 'src/users/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comment')
@UseGuards(AuthGuard())
export class CommentController {
    constructor(
        private commentService : CommentService,
    ){}
    
    @Post("/:postid/createComment")
    createComment(
        @Body(ValidationPipe) createCommentDto : CreateCommentDto,
        @Param("postid", new ParseIntPipe) postid : number,
        @GetUser() user : User, 
        ){
            return this.commentService.createComment(createCommentDto, postid, user);
        }

}
