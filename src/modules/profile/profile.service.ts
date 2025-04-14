import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProgressDto } from './dto/progress.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleFavorite(id: string, userId: string) {
    await this.prisma.$transaction(async (prisma: PrismaService) => {
      const userFavorites = await prisma.user.findUnique({
        where: { id: userId },
        select: { favorites: { select: { id: true } } },
      });

      const isExists = userFavorites?.favorites.some((book) => book.id === id);

      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            [isExists ? 'disconnect' : 'connect']: { id: id },
          },
        },
      });
    });
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
