import { BadRequestException, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SignUpOrSignInDto } from "../users/dto/signUpOrSignIn.dto";
import { User } from "../users/user.entity";
import { UserRepository } from "../users/user.repository";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "../users/Jwt-Payload.Interface";
import { JwtService } from "@nestjs/jwt";
import { PostService } from "../post/post.service";
import { CreatePostDto } from "../post/dto/createPost.dto";
import { FilterOperator, paginate, PaginateQuery } from "nestjs-paginate";
import { Post } from "../post/post.entity";
import { UserRoles } from "../users/userRoles.enum";
import { CommentService } from "../comment/comment.service";
import { CreateCommentDto } from '../comment/dto/createComment.dto';
import { Comment } from "../comment/comment.entity";
import { Repository } from "typeorm";

export class UserExceptionHandler {
    public static signUpExceptionHandler(userService : UsersService, signUpDto : SignUpOrSignInDto, logger : Logger) : Promise<void>{
        logger.verbose(`Someone trying to create a user. username : ${signUpDto.username}`)
        let result;
        try{
            result = userService.signUp(signUpDto);
            return result
        }catch(err){
            if(err instanceof BadRequestException){
                logger.verbose(`Cannot create user. data : ${signUpDto.username}`, err.stack)
                throw err
            }
            else{
                logger.error(`Cannot create user. data : ${signUpDto.username}`, err.stack)
                throw err
            }
        }
    }

    public static signInExceptionHandler(userService : UsersService, signInDto : SignUpOrSignInDto, logger : Logger){
        logger.verbose(`Someone trying to sign in as a user. data : ${signInDto.username}`)
        let result;
        try{
            result = userService.signIn(signInDto);
            return result
        }catch(err){
            logger.error(`Cannot sign in as user. username : ${signInDto.username}`, err.stack)
            throw err
        }
    }

    public static async signUpInRepositoryExceptionHandler(user : User,userRepository : Repository<User>, signUpDto : SignUpOrSignInDto, logger : Logger) : Promise<User>{
        try{
            await userRepository.save(user);
            return user;
        }
        catch(err){
            if(err.code === "23505"){
                logger.verbose(`Cannot sign up as user because username "${signUpDto.username}" is in use `)
                throw new BadRequestException("username is in use");
            }else{
                logger.error(`Failed to create new user with username = "${signUpDto.username}"`, err.stack)
                throw new InternalServerErrorException();
            }
        }
    }

    public static async signInInRepositoryExceptionHandler(userRepository : UserRepository,signInDto : SignUpOrSignInDto, logger : Logger){
        let user;
        try{
            user = await userRepository.findOne(signInDto.username)
        }catch(err){
            logger.error(`Failed sign in as user. username : ${signInDto.username}`, err.stack)
            throw err;
        }
        if(user && await user.validatePassword(signInDto.password)){
            return user;
        }
        return null
    }

    public static async hashPasswordExceptionHnadler(password : String, salt : String, logger : Logger){
        try{
            return await bcrypt.hash(password, salt);
        }catch(err){
            logger.error(`Failed to hash password.`, err.stack)
        }
    }
    public static async signInInServiceExceptionHandler(user : User, logger : Logger, jwtService : JwtService, signInDto : SignUpOrSignInDto){
        if(!user){
            logger.verbose(`Someone tried to sign in as "${signInDto.username}" with invalid creditionals.`)
            throw new UnauthorizedException("Invalid creditionals.")
        }
        try{
            const payload : JwtPayload = { username : user.username, role : user.role };
            const accessToken = await jwtService.sign(payload);
            return {accessToken};
        }catch(err){
            logger.error(`Cannot sign in as user. username : ${signInDto.username}`, err.stack)
        }
    }
    
}

export class PostExceptionHandler {
    static createPostExceptionHandler(postService : PostService, user, createPostDto : CreatePostDto,tags : string, logger : Logger){
        logger.verbose(`"${user.username}" trying to create a post.`)
        let result;
        try{
            result = postService.createPost(createPostDto, user, tags);
            return result;
        }catch(err){
            logger.error("Failed to create post.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static deletePostExceptionHandler(postService : PostService, user, id, logger : Logger){
        logger.verbose(`"${user.username}" trying to delete a post.`)
        let result;
        try{
            result = postService.deletePost(id, user);
            return result
        }catch(err){
            logger.error("Failed to delete post.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static getPostsExceptionHandler(postService : PostService, user, logger : Logger){
        logger.verbose(`"${user.username}" trying to get posts.`)
        let result;
        try{
            result = postService.getPosts(user);
            return result;
        }catch(err){
            logger.error("Failed to get posts.", err.stack)
            throw new InternalServerErrorException()
        }
    }
    public static getPaginatedPostsExceptionHandler(postService : PostService, user, query : PaginateQuery, logger : Logger){
        logger.verbose(`"${user.username}" trying to get paginated posts.`)
        let result;
        try{
            result = postService.getPostsPaginated(user, query);
            return result;
        }catch(err){
            logger.error("Failed to get paginated posts.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static editPostExceptionHandler(postService : PostService, user, id, createPostDto : CreatePostDto, tagsString : string, logger : Logger){
        logger.verbose(`"${user.username}" trying to edit a post.`)
            let result;
            try{
                result = postService.editPost(id, createPostDto, user, tagsString);
                return result;
            }catch(err){
                logger.error("Failed to edit a post.", err.stack)
                throw new InternalServerErrorException()
        }
    }

    public static async getPaginatedPostInServiceExceptionHandler(postRepository : Repository<Post>, user, query, logger : Logger){
        let result;
        try{
            result =  await paginate(query, postRepository, {
                loadEagerRelations: true,
                sortableColumns: ['postId', 'publicationDate', 'title', 'content', "tags.content"],
                nullSort: 'last',
                defaultSortBy: [['postId', 'DESC']],
                searchableColumns: ['title', 'content'],
                // select: ['postId', 'publicationDate', 'title', 'content', 'authorId', "tags.content"],
                filterableColumns: {
                'tags.content': [FilterOperator.IN],
                loadEagerRelations: true,
                },
            })
            logger.verbose(`"${user.username}" got paginated posts.`)
            return result;
        }
        catch(err){
            logger.error("Failed to get paginated posts.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async getPostsInServiceExceptionHandler(postRepository : Repository<Post>, user, logger : Logger){
        let result;
        try{
            result = await postRepository.find({relations : ["tags"]});
            logger.verbose(`"${user.username}" got posts.`)
            return result
        }catch(err){
            logger.error("Failed to get posts.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async editPostsInServiceExceptionHandler(post : Post, id, logger : Logger){
        try{
            await post.save();
            delete post.author;
            return post;
        }catch(err){
            logger.error(`Failed to edit post with id = ${id}`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async createPostInRepositoryExceptionHandler(post : Post, postRepository : Repository<Post>, logger : Logger){
        try{
            await postRepository.save(post);
            delete post.author;
            return post
        }catch(err){
            logger.error("Failed to ceate a post in repository.", err.stack)
        }
    }
    public static async getPostByIdInRepositoryExceptionHandler(repository : Repository<Post>, user, id, logger : Logger){
        let result
        try{
            result = await repository.findOne({where : {postId : id}});
        }catch(err){
            logger.error("Failed to get post from repository", err.stack);
            throw new InternalServerErrorException()
        }
        if(!result){
            logger.verbose(`User "${user.username} tried to get post with id = ${id} but there is not any post with this id."`)
            throw new NotFoundException(`there is no post with id = ${id}`)
        }
        return result;
    }
    public static async getPostByIdForEditOrDeleteInRepositoryExceptionHandler(repository : Repository<Post>, user, id, logger : Logger){
        let result
        try{
            if(user.role == UserRoles.ADMIN)
                result = await repository.findOne({where : {postId : id}});
            else
                result = await repository.findOne({where : {postId : id, authorId : user.id}});
        }catch(err){
            logger.error("Failed to get post from repository", err.stack);
            throw new InternalServerErrorException()
        }
        if(!result){
            logger.verbose(`User "${user.username} tried to get post for modification with id = ${id} but there is not any post with this id."`)
            throw new NotFoundException(`there is no post with id = ${id}`)
        }
        return result;
    }
}

export class CommentExceptionHandler {
    public static createCommentExceptionHandler(commentService : CommentService, user, createCommentDto : CreateCommentDto,postid , logger : Logger){
        logger.verbose(`"${user.username}" trying to create a comment.`)
        let result;
        try{
            result = commentService.createComment(createCommentDto, postid, user);
            return result;
        }catch(err){
            logger.error(`Failed to create comment.`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static deleteCommentExceptionHandler(commentService : CommentService, user, id, logger : Logger){
        logger.verbose(`"${user.username}" trying to delete a comment.`)
        let result;
        try{
            result = commentService.deleteComment(id, user);
            return result;
        }catch(err){
            logger.error(`Failed to delete comment.`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static editCommentExceptionHandler(commentService : CommentService, user, id, createCommentDto : CreateCommentDto, logger : Logger){
        logger.verbose(`"${user.username}" trying to edit a comment.`)
        let result;
        try{
            result = commentService.editComment(id,  createCommentDto ,user);
            return result;
        }catch(err){
            logger.error(`Failed to edit comment.`, err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async createCommentInRepositoryExceptionHandler(comment : Comment, logger : Logger){
        try {
            await comment.save();
            delete comment.author
            return comment;
        }catch(err){
            logger.error("Failed to add comment to repository", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async editCommentInRepositoryExceptionHandler(comment : Comment, logger : Logger){
        try{
            await comment.save();
            delete comment.author
            return comment;
        }catch(err){
            logger.error("Failed to edit a comment in repository.", err.stack)
            throw new InternalServerErrorException()
        }
    }

    public static async deleteCommentInRepositoryExceptionHandler(repository : Repository<Comment>, id, logger : Logger){
        try{
            await repository.delete({id})
        }catch(err){
            logger.error("Failed to delete a comment from repository.", err.stack)
            throw new InternalServerErrorException()
        }
    }
}