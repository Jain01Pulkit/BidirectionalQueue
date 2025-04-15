import { Module } from '@nestjs/common';
import { BundlerController } from './bundler.controller';
import { BundlerService } from './bundler.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { QueueModule } from 'src/queue/queue.module';
import { ConfigModule } from '@nestjs/config';
import { Client } from 'src/queue/rabbitMqClient/client';

@Module({
  imports: [TransactionModule,QueueModule,ConfigModule],
  controllers: [BundlerController],
  providers: [BundlerService]
})
export class BundlerModule {}
