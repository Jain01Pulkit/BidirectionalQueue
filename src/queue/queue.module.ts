import { Module } from '@nestjs/common';
import { ConsumerService } from './rabbitMqClient/consumer.service';
import { ProducerService } from './rabbitMqClient/producer.service';
import { ConfigModule } from '@nestjs/config';
import { Client } from './rabbitMqClient/client';
import amqp from 'amqp-connection-manager';
import { ConsumerServiceServer } from './rabbitMqServer/consumer.service';
import EventEmitter from 'events';
import Server from './rabbitMqServer/server';
import { ProducerServiceServer } from './rabbitMqServer/producer.service';
import { BundlerModule } from 'src/bundler/bundler.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { BundlerService } from 'src/bundler/bundler.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
    imports: [ConfigModule,BundlerModule, TransactionModule],
    providers: [
        ProducerService,
        ProducerServiceServer,
        ConsumerService,
        ConsumerServiceServer,
        Client,
        Server,
        BundlerService,
        TransactionService,
        {
            provide: 'QUEUE_NAME',
            useValue: ['amqp://guest:guest@127.0.0.1'],
        },
        {
            provide: 'CHANNEL_WRAPPER',
            useFactory: (queueName: string) => {
                const connection = amqp.connect(queueName);
                return connection.createChannel();
            },
            inject: ['QUEUE_NAME'],
        },
        {provide:'eventEmitter', useValue: EventEmitter},
    ],
    exports: [ProducerService,Client,Server],
})

export class QueueModule {}