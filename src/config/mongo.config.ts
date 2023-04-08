import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose/dist/typegoose-options.interface';

export const getMongoDbConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => ({
  uri: configService.get('MONGOURI'),
});
