import { Body, Controller, Query, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { GetUser } from './dto/getUser.decorator';
import { Post as PostEntity} from './post.entity';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
    constructor(
        private postService : PostService,
    ){}

    @Post("/createPost")
    test(
        @GetUser() user,
        @Body(ValidationPipe)createPostDto : CreatePostDto,
    ) : Promise<PostEntity>{
        console.log(user)
        return this.postService.createPost(createPostDto, user);
    }
}
