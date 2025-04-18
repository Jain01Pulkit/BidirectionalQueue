import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';
import { Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid'; // For correlation IDs
import { ProducerServiceServer } from './producer.service';
import { ConsumerServiceServer } from './consumer.service';
import { BundlerService } from 'src/bundler/bundler.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class Server implements OnModuleInit {
    private isInitialized:boolean = false;
    private connection:IAmqpConnectionManager;
    private producerChannel:ChannelWrapper;
    private consumerChannel:ChannelWrapper;
    private producer:ProducerServiceServer;
    private consumer:ConsumerServiceServer;

    constructor(
        private bundleTransaction: BundlerService,
        private transactionService: TransactionService
    ) {}


    async onModuleInit() {
        try {
            await this.inititalize('transactionBundle');
        } catch (error:any) {       
            console.log(error, 'RabbitMQ Server Initialization');
        }
    }

    async inititalize(queueName:string) {
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await amqp.connect(["amqp://guest:guest@127.0.0.1"]);
            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            const { queue: replyQueueName } = await this.consumerChannel.assertQueue(queueName, { exclusive: true, durable: false });
            this.producer = new ProducerServiceServer(this.producerChannel);
            this.consumer = new ConsumerServiceServer(this.consumerChannel, replyQueueName,this.producer,this.bundleTransaction,this.transactionService);
            this.consumer.consumeMessage();
            this.isInitialized = true;
        } catch (error:any) {
            console.log(error, 'RabbitMQ Initialize');
            throw Error(error);
        }
    }

    async produce(data:any, queueName:string, corelationId:string) {
        try {
            if (!this.isInitialized) {
                await this.inititalize(queueName);
            }

            let uuid = corelationId;
            if (!corelationId) {
                uuid = uuidv4();
            }

            return await this.producer.sendQueueServer(queueName,data, uuid);
        } catch (error:any) {
            console.log(error, 'RabbitMQ Server Producer');
            throw Error(error);
        }
    }
}
export default Server;
