import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export class idValidationPipe implements PipeTransform {
  transform(value: string, meta: ArgumentMetadata) {
    if (meta.type !== 'param') return value;
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('invalid format id');
    }
    return value;
  }
}
