import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, FilterSuffix, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { userRoles } from 'src/users/userRoles.enum';
import { resourceLimits } from 'worker_threads';
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

    public getPostsPaginated(user:User, query: PaginateQuery): Promise<Paginated<Post>> {
        if(user.role === userRoles.ADMIN){
            return paginate(query, this.postRepository, {
              sortableColumns: ['id', 'publicationDate', 'title', 'content'],
              nullSort: 'last',
              defaultSortBy: [['id', 'DESC']],
              searchableColumns: ['title', 'content'],
              select: ['id', 'publicationDate', 'title', 'content', 'authorId'],
              filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                age: true,
              },
            })
        }
        else{
            return paginate(query, this.postRepository, {
                where : {authorId : user.id},
              sortableColumns: ['id', 'publicationDate', 'title', 'content'],
              nullSort: 'last',
              defaultSortBy: [['id', 'DESC']],
              searchableColumns: ['title', 'content'],
              select: ['id', 'publicationDate', 'title', 'content', 'authorId'],
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

    async getPostById(id:number, user:User){
        if(user.role === userRoles.ADMIN){
            const result = await this.postRepository.findOne({where : {id}});
            if(!result){
                throw new NotFoundException(`there is no post with id = ${id}`)
            }
            return result;
        }
        else{
            const result = await this.postRepository.findOne({where :{ id, authorId : user.id }});
            if(!result){
                throw new NotFoundException(`you dont have any post with id = ${id}`)
            }
            return result;
        }
    }

    async editPost(id:number, createPostDto:CreatePostDto, user:User):Promise<Post>{
        const post = await this.getPostById(id, user);
        const { title, content } = createPostDto;
        post.title = title;
        post.content = content;
        await post.save();
        delete post.author;
        return post;
    }
}
