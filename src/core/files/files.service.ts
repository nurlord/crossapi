import { join } from 'path';
import { mkdirp, writeFile } from 'fs-extra';
import { FileResponse } from './files.interface';
import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';

@Injectable()
export class FilesService {
  async saveFiles(files: Express.Multer.File[]) {
    const uploadDir = `${path}/uploads/`;
    await mkdirp(uploadDir);
    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const filePath = join(uploadDir, file.originalname);
        await writeFile(filePath, file.buffer);

        return {
          url: `/uploads/${file.originalname}`,
          name: file.originalname,
        };
      }),
    );

    return response;
  }
}
