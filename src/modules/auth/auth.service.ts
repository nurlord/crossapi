import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { verify } from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async login(
    { login, password }: LoginDto,
    req: Request,
  ): Promise<{ user: User; sessionId: string }> {
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await verify(user.password, password);
    //const isValidPassword = password === user.password;

    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Failed to save session'),
          );
        }
        resolve({ user, sessionId: req.sessionID });
      });
    });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Failed to destroy the session'),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  public async register(dto: CreateUserDto) {
    const isExists = await this.usersService.findByLogin(dto.email);

    if (isExists) {
      throw new ConflictException('User already exists');
    }

    await this.usersService.create(dto);

    return {
      message: 'Registration successful',
    };
  }
}
