import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { BadRequestException } from '@nestjs/common';
import { PostExceptionHandler } from '../ExceptionHandler/ExceptionHandler';
import { User } from '../users/user.entity';

describe('UsersService', () => {
  let postService : PostService;
  let postRepository : PostRepository;

  beforeEach(async ()=>{
    const module = await Test.createTestingModule({
        providers: [
          JwtService,
            PostService,
            PostRepository,
        ],
    }).compile()
    postRepository = await module.get<PostRepository>(PostRepository);
    postService = await module.get<PostService>(PostService);
  })
  describe("create post", ()=>{
    it("create post successfully", ()=>{
        let post = new Post();
        PostExceptionHandler.createPostInRepositoryExceptionHandler = jest.fn().mockReturnValue(post);
        expect(postService.createPost({title : "t1", content : "c1"}, new User(),"[]")).resolves.toEqual(post);
    });
    it("create post not successfully", ()=>{
        PostExceptionHandler.createPostInRepositoryExceptionHandler = jest.fn().mockReturnValue(BadRequestException);
        expect(postService.createPost({title : "t1", content : "c1"}, new User(),"[]")).resolves.toThrow();
    })
  });
  describe("edit post", ()=>{
    it("edit post successfully", ()=>{
        let post = new Post();
        PostExceptionHandler.getPostByIdForEditOrDeleteInRepositoryExceptionHandler = jest.fn().mockReturnValue(post);
        expect(postService.editPost(1, {title : "t1", content : "c1"}, new User(),"[]")).resolves.toEqual(post);
    });
    it("edit post not successfully", ()=>{
        PostExceptionHandler.getPostByIdForEditOrDeleteInRepositoryExceptionHandler = jest.fn().mockReturnValue(BadRequestException);
        expect(postService.editPost(1, {title : "t1", content : "c1"}, new User(),"[]")).resolves.toThrow();
    })
  });
  describe("delete post", ()=>{
    it("delete post successfully", ()=>{
        let post = new Post();
        PostExceptionHandler.getPostByIdForEditOrDeleteInRepositoryExceptionHandler = jest.fn().mockReturnValue(post);
        expect(postRepository.deleteById(1)).resolves.toEqual(post);
    });
    it("delete post not successfully", ()=>{
        PostExceptionHandler.getPostByIdForEditOrDeleteInRepositoryExceptionHandler = jest.fn().mockReturnValue(BadRequestException);
        expect(postRepository.deleteById(1)).resolves.toThrow();
    })
  })
});