import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

function loggerConfig(config: any): Params | Promise<Params> {
  const logLevel: string = config.get('app.logLevel', { infer: true });
  const projectName: string = config.get('app.projectName', { infer: true });

  return {
    pinoHttp: {
      name: projectName,
      level: logLevel, //Determines the logging level threshold. Only messages with this level or higher will be logged (e.g., if logLevel is warn, only warn and error messages are logged).
      customLevels: { user: 1 },
      autoLogging: false, //If set to true , logging happens automatically for all incoming requests
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelKey: 'level',
          translateTime: 'yyyy-dd-mm, h:MM:ss TT',
          customColors: 'err: red, info: green, warn: blue',
          // customLevels: 'err: 99, info: 1',
        },
      },
    },
  };
}

export default loggerConfig;
