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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Audio file stream',
  })
  @ApiResponse({
    status: HttpStatus.PARTIAL_CONTENT,
    description: 'Partial content (byte range)',
  })
  streamAudio(
    @Param('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('endpoint start');
    const filePath = join(process.cwd(), 'uploads', name);

    console.log('filePath:', filePath);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      throw new NotFoundException('Audio file not found');
    }
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    const range = req.headers.range;
    if (!range) {
      console.log('Range header is missing');
      throw new BadRequestException('Range header is required');
    }

    const ranges = RangeParser(fileSize, range);
    if (ranges === -1) {
      console.log('Invalid range');
      res
        .status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
        .send('Invalid range');
      return;
    }

    const { start, end } = ranges[0];
    console.log(`Range start: ${start}, end: ${end}`);

    res.status(HttpStatus.PARTIAL_CONTENT);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', end - start + 1);
    res.setHeader('Content-Type', 'audio/mpeg');

    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
  }
}
