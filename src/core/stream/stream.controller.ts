import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { join } from 'path';
import { Response, Request } from 'express';
import * as fs from 'fs';
import RangeParser from 'range-parser';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/src/shared/decorators/public.decorator';

@Controller('stream')
export class StreamController {
  @Public()
  @Get(':name')
  @ApiOperation({ summary: 'Stream audio file by range' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Audio file stream' })
  @ApiResponse({
    status: HttpStatus.PARTIAL_CONTENT,
    description: 'Partial content (byte range)',
  })
  streamAudio(
    @Param('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', name);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Audio file not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    const range = req.headers.range;

    if (!range) {
      // ✅ Fallback: full file stream (just_audio will auto-request chunks later)
      res.status(HttpStatus.OK);
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', 'audio/mpeg');

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return;
    }

    // ✅ Range requested
    const ranges = RangeParser(fileSize, range);
    if (ranges === -1 || ranges === -2) {
      res
        .status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
        .send('Invalid range');
      return;
    }

    const { start, end } = ranges[0];
    const chunkSize = end - start + 1;

    res.status(HttpStatus.PARTIAL_CONTENT);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', chunkSize);
    res.setHeader('Content-Type', 'audio/mpeg');

    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
  }
}
