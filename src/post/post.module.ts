import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { TagRepository } from './tag.repository';

@Module({
  imports : [TypeOrmModule.forFeature([PostRepository, TagRepository]), UsersModule,],
  controllers: [PostController],
  providers: [PostService, PostRepository, TagRepository],
  exports: [TagRepository, PostRepository]
})
export class PostModule {}
