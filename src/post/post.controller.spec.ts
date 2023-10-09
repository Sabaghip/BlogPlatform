import { Test, TestingModule } from '@nestjs/testing';
import { PostExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

describe('PostsController', () => {
  let postController : PostController;
  let postService : PostService;
  let postRepository : PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        PostController,
        PostService,
        PostRepository,
        PostExceptionHandler,
      ],
    }).compile();
    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    });

  describe("create post", ()=>{
    it("create post successfully", async()=>{
        const post = new Post();
        PostExceptionHandler.createPostExceptionHandler = jest.fn().mockReturnValue(post);
        expect(postController.createPost({username : "username"}, {content : "c1", title : "t1"}, `[]`)).toEqual(post);
    })
    it("create post not successfully", async()=>{
        PostExceptionHandler.createPostExceptionHandler = jest.fn().mockReturnValue(BadRequestException);
        expect(postController.createPost({username : "username"}, {content : "c1", title : "t1"}, `[]`)).toThrow();
    })
  })

  describe("edit post", ()=>{
    it("edit post successfull", async()=>{
        const post = new Post();
        PostExceptionHandler.editPostExceptionHandler = jest.fn().mockReturnValue(post);
        expect(postController.editPost(1, new User(), {content : "c1", title : "t1"}, `[]`)).toEqual(post);
    })
    it("edit post not successfull", async()=>{
        PostExceptionHandler.editPostExceptionHandler = jest.fn().mockReturnValue(BadRequestException);
        expect(postController.editPost(1, new User(), {content : "c1", title : "t1"}, `[]`)).toThrow();
    })
  })

  describe("delete post", ()=>{
    it("delete post successfull", async()=>{
        const post = new Post();
        PostExceptionHandler.deletePostExceptionHandler = jest.fn().mockReturnValue(post);
        expect(postController.deletePost(1, new User())).toEqual(post);
    })
    it("delete post not successfull", async()=>{
        PostExceptionHandler.deletePostExceptionHandler = jest.fn().mockReturnValue(BadRequestException);
        expect(postController.deletePost(1, new User())).toThrow();
    })
  })
});