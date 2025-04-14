import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { join } from 'path';
import { Response, Request } from 'express';
import * as fs from 'fs';

@Controller('stream')
export class StreamController {
  @Get(':name')
  streamAudio(
    @Param('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', name);

    if (!fs.existsSync(filePath)) {
      console.log('File not found at', filePath);
      return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      });

      fs.createReadStream(filePath).pipe(res);
    }
  }
}
