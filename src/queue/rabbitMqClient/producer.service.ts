import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { EventEmitter } from 'events';
@Injectable()
export class ProducerService {
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

    async sendQueue(queueName: string, data: any, correlationId?: string): Promise<any> {
        try {
            const send: boolean = await this.channelWrapper.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(data)),
                {
                    replyTo: this.queueName, correlationId,
                    persistent: true
                }
            )
            this?.eventEmitter?.setMaxListeners(0);
            if (!send) throw new Error('Error in sending data to queue');
            // const response = await Promise.race([
            return new Promise((resolve, reject) => {
                this.eventEmitter.once(correlationId as any, (msg: any) => {
                    const reply = JSON.parse(msg.content.toString());
                    if (!reply) reject(new Error('Empty reply'));
                    const userResult = reply.find((res: any) => res.uniqueId === data.uniqueId);
                    console.log(userResult, 'userResult');
                    console.log(data, 'data');
                    console.log(reply, 'reply');
                    resolve(reply);
                });
            })
        } catch (error: any) {
            Logger.error(error, 'sendQueue error')
        }
    }
}