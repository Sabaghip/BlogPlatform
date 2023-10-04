import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { PostRepository } from 'src/post/post.repository';
import { TagRepository } from 'src/post/tag.repository';
import { UsersModule } from 'src/users/users.module';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports : [TypeOrmModule.forFeature([CommentRepository]), UsersModule, PostModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository]
})
export class CommentModule {}
