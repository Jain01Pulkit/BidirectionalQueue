import { Inject, Injectable } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import EventEmitter from 'events';

const MAX_RETRIES = 5;
@Injectable()
export class ConsumerService {
    constructor(
        @Inject('CHANNEL_WRAPPER') private channelWrapper: ChannelWrapper,
        @Inject('QUEUE_NAME') private queueName: string,
        @Inject('eventEmitter') private eventEmitter: EventEmitter
    ) { }

    /**
     * @param {string} queueName 
     * @param {any} data 
     * @returns {Promise<PromiseResolve>}
     * @memberof ProducerService
     * @description: Function to send data to the specified queue
     */
    async consumeMessage() {
        try {
            this?.eventEmitter?.setMaxListeners(0);
            this.channelWrapper.consume(this.queueName, (message: any) => {
                this.eventEmitter.emit(message.properties.correlationId.toString(), message);
                this.channelWrapper.ack(message);
            }, {
                noAck: false,
            });
        } catch (error) {
            console.log(error, 'Consumer Client consumeMessage');
            throw Error(error);
        }
    }
}
