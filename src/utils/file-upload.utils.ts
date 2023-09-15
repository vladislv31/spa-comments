import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
// Разрешить только изображения
export const imageFileFilter = (req, file, callback) => {
  if (file.originalname.match(/\.(jpg|png|gif)$/)) {
    callback(null, true);
  } else if (file.originalname.match(/\.(txt)$/)) {
    if (file.size > 102400) {
      return callback(
        new HttpException(
          'Text files should not exceed 100 KB!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  } else {
    return callback(
      new HttpException(
        'Only image and text files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
};
export const editFileName = (file) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  return `${name}${randomName}${fileExtName}`;
};
