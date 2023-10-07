import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Module({
  imports : [
    PassportModule.register({ defaultStrategy : "jwt"}),
    JwtModule.register({secret : "someCode123", signOptions:{expiresIn : 3600},}),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository,JwtStrategy, Repository<User>],
  exports : [JwtStrategy, PassportModule,],
})
export class UsersModule {}
