import { Body, Controller, Post, UseGuards, Param, ParseIntPipe, Delete, Patch, Logger, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
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
        @Body()createPostDto : CreatePostDto,
        @Body("tags", TagsPipe) tags : string,
    ) : Promise<PostEntity>{
        this.logger.verbose(`"${user.username}" trying to create a post.`)
        return this.postService.createPost(createPostDto, user, tags);
    }

    @Delete("/:postid")
    deletePost(
        @Param("postid",new ParseIntPipe) postid,
        @GetUser() user : User,
        ){
            this.logger.verbose(`"${user.username}" trying to delete a post.`)
            return this.postService.deletePost(postid, user);
    }

    @Get("/getPosts")
    getPosts(@GetUser() user : User){
        this.logger.verbose(`"${user.username}" trying to get posts.`)
        return this.postService.getPosts(user);
    }

    @Post("/getPostsPaginated")
    getPostsPaginated(@GetUser() user : User, @Paginate() query: PaginateQuery){
        this.logger.verbose(`"${user.username}" trying to get paginated posts.`)
        return this.postService.getPostsPaginated(user, query);
    }

    @Patch("/:postid")
    editPost(
        @Param("postid",new ParseIntPipe) postid,
        @GetUser() user : User,
        @Body() createPostDto : CreatePostDto,
        @Body("tags", TagsPipe) tagsString : string,
        ){
            this.logger.verbose(`"${user.username}" trying to edit a post.`)
            return this.postService.editPost(postid, createPostDto, user, tagsString);
    }
}
