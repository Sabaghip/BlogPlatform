import { Body, Controller, Query, Post, Req, UseGuards, ValidationPipe, Param, ParseIntPipe, Delete, Patch, Logger, InternalServerErrorException, Get } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PostExceptionHandler } from 'src/ExceptionHandler/ExceptionHandler';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { GetUser } from './dto/getUser.decorator';
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

    @Post("/createPost")
    createPost(
        @GetUser() user,
        @Body(ValidationPipe)createPostDto : CreatePostDto,
        @Body("tags", TagsPipe) tags : string,
    ) : Promise<PostEntity>{
        return PostExceptionHandler.createPostExceptionHandler(this.postService, user, createPostDto, tags, this.logger)
    }

    @Delete("/:id/deletePost")
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
        this.logger.verbose(`"${user.username}" trying to get paginated posts.`)
        let result;
        try{
            result = this.postService.getPostsPaginated(user, query);
            return result;
        }catch(err){
            this.logger.error("Failed to get paginated posts.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    @Patch("/:id/editpost")
    editPost(
        @Param("id",new ParseIntPipe) id,
        @GetUser() user : User,
        @Body(ValidationPipe) createPostDto : CreatePostDto,
        @Body("tags", TagsPipe) tags : string,
        ){
            PostExceptionHandler.editPostExceptionHandler(this.postService, user, id, createPostDto, tags, this.logger);
    }
}
