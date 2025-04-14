import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from '@/src/core/prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAuthorDto: CreateAuthorDto) {
    return this.prisma.author.create({ data: { name: createAuthorDto.name } });
  }

  async findAll() {
    return this.prisma.author.findMany();
  }

  async findOne(id: string) {
    return this.prisma.author.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    return this.prisma.author.update({
      where: { id },
      data: { ...updateAuthorDto },
    });
  }

  async remove(id: string) {
    return this.prisma.author.delete({ where: { id } });
  }
}
