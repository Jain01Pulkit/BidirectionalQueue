import { Inject, Injectable } from '@nestjs/common';
import client from '../rabbitMqClient/client';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ProducerServiceServer } from './producer.service';
import { BundlerService } from 'src/bundler/bundler.service';
import { TransactionService } from 'src/transaction/transaction.service';

const MAX_RETRIES = 5;
@Injectable()
export class ConsumerServiceServer {
    constructor(
        @Inject('CHANNEL_WRAPPER') private channelWrapper: ChannelWrapper,
        @Inject('QUEUE_NAME') private queueName: string,
        private producer: ProducerServiceServer,
        private bundleTransaction: BundlerService,
        private transactionService: TransactionService
    ) { }

    async consumeMessage(): Promise<any> {
        try {
            await this.channelWrapper.consume(this.queueName, async (message: any) => {
                const { correlationId, replyTo } = message.properties;
                if (!correlationId || !replyTo) {
                    throw Error('Some Properties are missing');
                }
                const bundledTransactions = this.bundleTransaction.generateBundle(JSON.parse(message.content.toString()));
                const batcheResponse = await this.transactionService.processInBatches(bundledTransactions);
                await this.producer.sendQueueServer(replyTo, batcheResponse, correlationId);
                this.channelWrapper.ack(message);
            }, {
                noAck: false,
            });
        } catch (error) {
            console.log(error, 'Consumer Server consumeMessage');
            throw Error(error);
        }
    }
}
