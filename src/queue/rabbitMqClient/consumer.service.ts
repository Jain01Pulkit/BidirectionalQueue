import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';
import { ConfirmChannel } from 'amqplib';
import EventEmitter from 'events';

const MAX_RETRIES = 5;
@Injectable()
export class ConsumerService {
    constructor(
        @Inject('CHANNEL_WRAPPER') private channelWrapper:ChannelWrapper, @Inject('QUEUE_NAME') private queueName:string,@Inject('eventEmitter') private eventEmitter: EventEmitter

    ) {
        // const connection: IAmqpConnectionManager = amqp.connect(this.queueName);

        // connection.on('connect', () => Logger.log('Connected to RabbitMQ'));
        // connection.on('disconnect', (err) => Logger.error(err, 'RabbitMQ Disconnected! Retrying...'));

        // this.channelWrapper = connection.createChannel();
    }

    /**
     * @param {string} queueName 
     * @param {any} data 
     * @returns {Promise<PromiseResolve>}
     * @memberof ProducerService
     * @description: Function to send data to the specified queue
     */
    async consumeMessage() {
        try {
            console.log("hereeeeeconsume",this.queueName);
            this?.eventEmitter?.setMaxListeners(0);
            this.channelWrapper.consume(this.queueName, (message:any) => {
                console.log('the reply message is ', message.content.toString());
                this?.eventEmitter?.emit(message.properties.correlationId.toString(), message);
            }, {
                noAck: true,
            });
        } catch (error) {
            console.log(error, 'Consumer Client consumeMessage');
            throw Error(error);
        }
    }
}
