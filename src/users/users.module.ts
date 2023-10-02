import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports : [
    PassportModule.register({ defaultStrategy : "jwt"}),
    JwtModule.register({secret : "someCode123", signOptions:{expiresIn : 3600},}),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository,JwtStrategy,],
  exports : [JwtStrategy, PassportModule,],
})
export class UsersModule {}
