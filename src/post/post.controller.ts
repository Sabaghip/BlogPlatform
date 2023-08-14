import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
    constructor(
        private postService : PostService,
    ){}

    @Post("/test")
    test(@Query() q){
        console.log(q);
    }
}
