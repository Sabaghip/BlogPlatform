import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, FilterSuffix, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
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

    async createPost(createPostDto : CreatePostDto, user:User, tags:string): Promise<Post>{
        return await this.postRepository.createPost(createPostDto, user, tags);
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

    async getPostsPaginated(user:User, query: PaginateQuery): Promise<Paginated<Post>> {
        if(user.role === userRoles.ADMIN){
            return await paginate(query, this.postRepository, {
              sortableColumns: ['id', 'publicationDate', 'title', 'content'],
              nullSort: 'last',
              defaultSortBy: [['id', 'DESC']],
              searchableColumns: ['title', 'content'],
              select: ['id', 'publicationDate', 'title', 'content', 'authorId', 'tags'],
              filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                age: true,
              },
            })
        }
        else{
            return await paginate(query, this.postRepository, {
                where : {authorId : user.id},
              sortableColumns: ['id', 'publicationDate', 'title', 'content'],
              nullSort: 'last',
              defaultSortBy: [['id', 'DESC']],
              searchableColumns: ['title', 'content'],
              select: ['id', 'publicationDate', 'title', 'content', 'authorId', 'tags'],
              filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                age: true,
              },
            })
          }
        }
        

    async getPosts(user : User){
        if(user.role === userRoles.ADMIN){
            return await this.postRepository.find()
        }
        else{
            return await this.postRepository.find({where :{ authorId : user.id }})
        }
    }

    async editPost(id:number, createPostDto:CreatePostDto, user:User, tags:string):Promise<Post>{
        const post = await this.postRepository.getPostById(id, user);
        const { title, content } = createPostDto;
        post.title = title;
        post.content = content;
        post.tags = tags;
        await post.save();
        delete post.author;
        return post;
    }
}
