import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';
import { TypeORMError } from 'typeorm';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports : [TypeOrmModule.forFeature([CommentRepository]), UsersModule, PostModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository]
})
export class CommentModule {}
