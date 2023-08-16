import { Body, Controller, Query, Post, Req, UseGuards, ValidationPipe, Param, ParseIntPipe, Delete, Patch, Logger, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
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
        this.logger.verbose(`"${user.username}" trying to create a post.`)
        let result;
        try{
            result = this.postService.createPost(createPostDto, user, tags);
            return result;
        }catch(err){
            this.logger.error("Failed to create post.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    @Delete("/:id/deletePost")
    deletePost(
        @Param("id",new ParseIntPipe) id,
        @GetUser() user : User,
        ){
            this.logger.verbose(`"${user.username}" trying to delete a post.`)
            let result;
            try{
                result = this.postService.deletePost(id, user);
                return result
            }catch(err){
                this.logger.error("Failed to delete post.", err.stack)
                throw new InternalServerErrorException()
            }
    }

    @Post("/getPosts")
    getPosts(@GetUser() user : User){
        this.logger.verbose(`"${user.username}" trying to get posts.`)
        let result;
        try{
            result = this.postService.getPosts(user);
            return result;
        }catch(err){
            this.logger.error("Failed to get posts.", err.stack)
            throw new InternalServerErrorException()
        }
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
            this.logger.verbose(`"${user.username}" trying to edit a post.`)
            let result;
            try{
                result = this.postService.editPost(id, createPostDto, user, tags);
                return result;
            }catch(err){
                this.logger.error("Failed to edit a post.", err.stack)
                throw new InternalServerErrorException()
        }

    }


}
