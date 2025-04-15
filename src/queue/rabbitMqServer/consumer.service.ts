import { Inject, Injectable } from '@nestjs/common';
import client from '../rabbitMqClient/client';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ProducerServiceServer } from './producer.service';

const MAX_RETRIES = 5;
@Injectable()
export class ConsumerServiceServer {
    constructor(
        @Inject('CHANNEL_WRAPPER') private channelWrapper:ChannelWrapper, @Inject('QUEUE_NAME') private queueName:string,
        private producer:ProducerServiceServer,
    ){}

    /**
     * @param {string} queueName 
     * @param {any} data 
     * @returns {Promise<PromiseResolve>}
     * @memberof ProducerService
     * @description: Function to send data to the specified queue
     */
    async consumeMessage(): Promise<any> {
        try {
            this.channelWrapper.consume(this.queueName, (message:any) => {
                console.log("consimong");
                const { correlationId, replyTo } = message.properties;
                if (!correlationId || !replyTo) {
                    throw Error('Some Prorperties are missing');
                }
                const data = JSON.parse(message.content.toString());
                console.log('the reply message is ', data);

                // const clientINstance = new client();
                // clientINstance.produce(data, replyTo, correlationId);
                this.producer.sendQueueServer(replyTo, data, correlationId);
            }, {
                noAck: true,
            });
        } catch (error) {
            console.log(error, 'Consumer Server consumeMessage');
            throw Error(error);
        }
    }
}
