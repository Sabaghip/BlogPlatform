import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let postService : PostService;
  let postRepository : PostRepository;
  let post;

  beforeEach(async ()=>{
    const module = await Test.createTestingModule({
        providers: [
          JwtService,
            PostService,
            PostRepository,
            Post
        ],
    }).compile()
    postRepository = await module.get<PostRepository>(PostRepository);
    postService = await module.get<PostService>(PostService);
    post = await module.get<Post>(Post);
  })
  describe("create post", ()=>{
    it("create post successfully", ()=>{
        postRepository.save = jest.fn().mockResolvedValue(post)
        expect(postService.createPost({title : "t1", content : "c1"}, new User(),"[]")).resolves.toEqual(post);
    });
    it("create post not successfully", ()=>{
        postRepository.save = jest.fn().mockResolvedValue(BadRequestException)
        expect(postService.createPost({title : "t1", content : "c1"}, new User(),"[]")).resolves.toThrow();
    })
  });
  describe("edit post", ()=>{
    it("edit post successfully", ()=>{
      postRepository.getPostByIdForEditOrDelete = jest.fn().mockResolvedValue(post)
      postRepository.save = jest.fn().mockResolvedValue(post)
        expect(postService.editPost(1, {title : "t1", content : "c1"}, new User(),"[]")).resolves.toEqual(post);
    });
    it("edit post not successfully", ()=>{
      postRepository.getPostByIdForEditOrDelete = jest.fn().mockResolvedValue(BadRequestException)
      postRepository.save = jest.fn().mockResolvedValue(post)
        expect(postService.editPost(1, {title : "t1", content : "c1"}, new User(),"[]")).resolves.toThrow();
    })
  });
  describe("delete post", ()=>{
    it("delete post successfully", ()=>{
      postRepository.getPostByIdForEditOrDelete = jest.fn().mockResolvedValue(post)
      postRepository.deleteById = jest.fn().mockResolvedValue(post)
      expect(postRepository.deleteById(1)).resolves.toEqual(post);
    });
    it("delete post not successfully", ()=>{
      postRepository.getPostByIdForEditOrDelete = jest.fn().mockResolvedValue(BadRequestException)
      postRepository.save = jest.fn().mockResolvedValue(post)
      expect(postRepository.deleteById(1)).resolves.toThrow();
    })
  })
});