import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUser } from '@/src/shared/decorators/user.decorator';
import { ProgressDto } from './dto/progress.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch('favorites/:id')
  async toggleFavorite(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.profileService.toggleFavorite(id, userId);
  }

  @Post('progress')
  async saveProgress(
    @Body() progressDto: ProgressDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.profileService.saveProgress(progressDto, userId);
  }

  @Get('progress/:id')
  async getProgress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.profileService.getProgress(id, userId);
  }
}
