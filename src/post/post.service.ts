import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { userRoles } from 'src/users/userRoles.enum';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostRepository)
        private postRepository : PostRepository,
    ){}

    async createPost(createPostDto : CreatePostDto, user:User): Promise<Post>{
        return await this.postRepository.createPost(createPostDto, user);
    }

    async deletePost(id:number, user:User){
        if(user.role === userRoles.ADMIN){
            const result = await this.postRepository.delete({id})
            if(result.affected === 0){
                throw new NotFoundException(`there is no post with id = ${id}`)
            }
        }else{
            const result = await this.postRepository.delete({id, authorId: user.id});
            if(result.affected === 0){
                throw new NotFoundException(`You dont have any post with id = ${id}`);
            }
        }
        
    }
}
