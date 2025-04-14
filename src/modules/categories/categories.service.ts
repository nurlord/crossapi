import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/src/core/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { name: createCategoryDto.name },
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    return this.prisma.category.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, updatecategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: { ...updatecategoryDto },
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
