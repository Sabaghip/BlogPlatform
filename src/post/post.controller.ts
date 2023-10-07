import { Body, Controller, Post, UseGuards, ValidationPipe, Param, ParseIntPipe, Delete, Patch, Logger, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PostExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { GetUser } from './decorators/getUser.decorator';
import { TagsPipe } from './Pipes/tags.pipe';
import { Post as PostEntity} from './post.entity';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
    private logger = new Logger("PostController")
    constructor(
        private postService : PostService,
    ){}

    @Post("")
    createPost(
        @GetUser() user,
        @Body(ValidationPipe)createPostDto : CreatePostDto,
        @Body("tags", TagsPipe) tags : string,
    ) : Promise<PostEntity>{
        return PostExceptionHandler.createPostExceptionHandler(this.postService, user, createPostDto, tags, this.logger)
    }

    @Delete("/:id")
    deletePost(
        @Param("id",new ParseIntPipe) id,
        @GetUser() user : User,
        ){
            return PostExceptionHandler.deletePostExceptionHandler(this.postService, user, id, this.logger);
    }

    @Get("/getPosts")
    getPosts(@GetUser() user : User){
        return PostExceptionHandler.getPostsExceptionHandler(this.postService, user, this.logger);
    }

    @Post("/getPostsPaginated")
    getPostsPaginated(@GetUser() user : User, @Paginate() query: PaginateQuery){
        PostExceptionHandler.getPaginatedPostsExceptionHandler(this.postService, user, query, this.logger);
    }

    @Patch("/:id")
    editPost(
        @Param("id",new ParseIntPipe) id,
        @GetUser() user : User,
        @Body(ValidationPipe) createPostDto : CreatePostDto,
        @Body("tags", TagsPipe) tagsString : string,
        ){
            return PostExceptionHandler.editPostExceptionHandler(this.postService, user, id, createPostDto, tagsString, this.logger);
    }
}
