import { Module } from '@nestjs/common';
import generateModuleSet from './module-set';

@Module({
  imports: generateModuleSet(),
})

export class AppModule {}
