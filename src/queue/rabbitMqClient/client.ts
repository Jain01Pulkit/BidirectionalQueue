import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';

@Injectable()
export class Client implements OnModuleInit {
    private isInitialized: boolean = false;
    private connection: IAmqpConnectionManager;
    private producerChannel: ChannelWrapper;
    private consumerChannel: ChannelWrapper;
    private eventEmitter: EventEmitter;
    private producer: ProducerService;
    private consumer: ConsumerService;

    constructor() { }

    async onModuleInit() {
        try {
            await this.inititalize();
        } catch (error: any) {
            Logger.error(error, 'RabbitMQ Client Initialization');
        }
    };
    async inititalize() {
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await amqp.connect(["amqp://guest:guest@127.0.0.1"]);
            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            const { queue: replyQueueName } = await this.consumerChannel.assertQueue('transactionBundle', { exclusive: true });

            this.eventEmitter = new EventEmitter();
            this.eventEmitter.setMaxListeners(0);
            this.producer = new ProducerService(this.producerChannel, replyQueueName, this.eventEmitter);
            this.consumer = new ConsumerService(this.consumerChannel, replyQueueName, this.eventEmitter);
            this.consumer.consumeMessage();

            this.isInitialized = true;
        } catch (error: any) {
            console.log(error, 'RabbitMQ Initialize');
            throw Error(error);
        }
    }

    public async produce(data: any, queueName: string, corelationId?: string) {
        try {
            if (!this.isInitialized) {
                await this.inititalize();
            }

            let uuid = corelationId;
            if (!corelationId) {
                uuid = uuidv4();
            }

            const queueResponse = await this.producer.sendQueue(queueName, data, uuid);
            if (!queueResponse || queueResponse.error) {
                return {
                    message: 'Something Went Wrong!',
                    error: true,
                };
            }
            return {
                data: queueResponse,
                message: 'Transactions Completed',
                error: false,
            };
        } catch (error: any) {
            console.log(error, 'RabbitMQ Producer');
            throw Error(error);
        }
    }
}
export default Client;
