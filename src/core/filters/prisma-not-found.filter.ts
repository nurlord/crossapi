import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2025':
        response.status(404).json({ message: 'Record not found' });
        break;
      case 'P2002':
        response.status(409).json({ message: 'Unique constraint violation' });
        break;
      default:
        response.status(500).json({ message: 'Internal server error' });
        break;
    }
  }
}
