import { forwardRef, Module } from '@nestjs/common';
import { BundlerController } from './bundler.controller';
import { BundlerService } from './bundler.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { QueueModule } from 'src/queue/queue.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from 'src/models/transaction.model';

@Module({
  imports: [
    forwardRef(() => QueueModule),
    ConfigModule,
    forwardRef(() => TransactionModule),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [BundlerController],
  providers: [BundlerService],
})
export class BundlerModule {}
