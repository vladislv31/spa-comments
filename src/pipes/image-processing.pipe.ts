import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as sharp from 'sharp';
import { editFileName } from 'src/utils/file-upload.utils';

const writeFile = util.promisify(fs.writeFile);

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (file) {
      const convertedName = editFileName(file);

      if (file.mimetype.startsWith('image')) {
        const metadata = await sharp(file.buffer).metadata();

        if (metadata.width > 320 || metadata.height > 240) {
          await sharp(file.buffer)
            .resize({
              width: 320,
              height: 240,
              fit: 'inside',
            })
            .toFile(path.join('uploads', convertedName));
        } else {
          await sharp(file.buffer).toFile(path.join('uploads', convertedName));
        }
      } else {
        if (file.size > 102400) {
          throw new HttpException(
            {
              message: ['Text files should not exceed 100 KB!'],
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        await writeFile(path.join('uploads', convertedName), file.buffer);
      }

      file.filename = convertedName;
      file.path = path.join('uploads', convertedName);
    }

    return file;
  }
}
