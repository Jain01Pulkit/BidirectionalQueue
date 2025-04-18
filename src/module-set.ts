import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import queueConfig from 'src/config/queue.config';
import { QueueModule } from './queue/queue.module';
import loggerConfig from './logger-factory';
import appConfig from './config/app.config';
import { BundlerModule } from './bundler/bundler.module';
import { MongooseModule } from '@nestjs/mongoose';

export default function generateModuleSet() {
    const imports: ModuleMetadata['imports'] = [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [queueConfig,appConfig],
        envFilePath: ['.env'],
      }),
      LoggerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: loggerConfig,
      }),
      QueueModule,
      BundlerModule, MongooseModule.forRoot('mongodb://localhost:27017/test')
    ];
    return imports;
}
  