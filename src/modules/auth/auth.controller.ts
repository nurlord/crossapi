import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { Public } from '@/src/shared/decorators/public.decorator';
import { UpdateUserDto } from './users/dto/update-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  public async login(
    @Body() { login, password }: LoginDto,
    @Req() req: Request,
  ) {
    const { user, sessionId } = await this.authService.login(
      { login, password },
      req,
    );

    const { password: _, ...rest } = user;
    return {
      message: 'Login successful',
      rest,
      sessionId,
    };
  }

  @Patch('update')
  async updateUser(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const updatedUser = await this.usersService.update(userId, dto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @Public()
  @Post('register')
  public async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req, res);
  }

  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.session.userId;

    const user = await this.usersService.findById(userId);
    return {
      message: 'User profile fetched successfully',
      user,
    };
  }
}
