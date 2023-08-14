import { Body, Controller, Query, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { Post as PostEntity} from './post.entity';
import { PostService } from './post.service';

@Controller('post')

export class PostController {
    constructor(
        private postService : PostService,
    ){}

    @Post("/createPost")
    @UseGuards(AuthGuard())
    test(@Req() req,
    @Body(ValidationPipe)createPostDto : CreatePostDto,
    ) : Promise<PostEntity>{
        return this.postService.createPost(createPostDto, req.user);
    }
}
