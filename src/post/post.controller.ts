import { Body, Controller, Query, Post, Req, UseGuards, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNumber } from 'class-validator';
import { User } from 'src/users/user.entity';
import { IntegerType } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { GetUser } from './dto/getUser.decorator';
import { PostIdDto } from './dto/post-id.dto';
import { Post as PostEntity} from './post.entity';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
    constructor(
        private postService : PostService,
    ){}

    @Post("/createPost")
    createPost(
        @GetUser() user,
        @Body(ValidationPipe)createPostDto : CreatePostDto,
    ) : Promise<PostEntity>{
        return this.postService.createPost(createPostDto, user);
    }

    @Post("/:id/deletePost")
    deletePost(
        @Param("id",new ParseIntPipe) id,
        @GetUser() user : User,
        ){
        return this.postService.deletePost(id, user);
    }

    @Post("/getPosts")
    getPosts(@GetUser() user : User){
        return this.postService.getPosts(user);
    }

}
