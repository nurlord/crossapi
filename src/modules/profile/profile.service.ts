import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProgressDto } from './dto/progress.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleFavorite(audiobookId: string, userId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_audiobookId: {
          userId,
          audiobookId,
        },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: {
          userId_audiobookId: {
            userId,
            audiobookId,
          },
        },
      });
    } else {
      await this.prisma.favorite.create({
        data: {
          userId,
          audiobookId,
        },
      });
    }

    return true;
  }
  async saveProgress(progressDto: ProgressDto, userId: string) {
    const isExists = await this.prisma.progress.findUnique({
      where: {
        userId_audiobookId: {
          audiobookId: progressDto.audiobookId,
          userId: userId,
        },
      },
    });

    if (!isExists) {
      return this.prisma.progress.create({
        data: {
          userId,
          audiobookId: progressDto.audiobookId,
          positionSec: progressDto.positionSec,
        },
      });
    }

    return this.prisma.progress.update({
      where: {
        userId_audiobookId: {
          userId,
          audiobookId: progressDto.audiobookId,
        },
      },
      data: {
        positionSec: progressDto.positionSec,
      },
    });
  }

  async getProgress(id: string, userId: string) {
    return this.prisma.progress.findUnique({
      where: { id, userId },
      include: { user: true },
    });
  }
}
