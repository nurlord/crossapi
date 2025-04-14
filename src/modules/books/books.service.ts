import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Audiobook } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return this.prisma.audiobook.create({
      data: {
        publishedAt: createBookDto.publishDate,
        title: createBookDto.title,
        categoryId: createBookDto.categoryId,
        authorId: createBookDto.authorId,
        coverUrl: createBookDto?.coverUrl,
        description: createBookDto.description,
        fileName: createBookDto.fileName,
      },
    });
  }
  async findAll(): Promise<Audiobook[]> {
    return this.prisma.audiobook.findMany({
      include: {
        author: true,
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<Audiobook> {
    return this.prisma.audiobook.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    return this.prisma.audiobook.update({
      where: { id },
      data: {
        ...updateBookDto,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.audiobook.delete({ where: { id } });
  }
}
