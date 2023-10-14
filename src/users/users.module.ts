import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtExpiresIn, JwtPassword } from 'src/config/Parameters';

@Module({
  imports : [
    PassportModule.register({ defaultStrategy : "jwt"}),
    JwtModule.register({secret : JwtPassword, signOptions:{expiresIn : JwtExpiresIn},}),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository,JwtStrategy],
  exports : [JwtStrategy, PassportModule,],
})
export class UsersModule {}
