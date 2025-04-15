import { Inject, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
@Injectable()
export class ProducerServiceServer {
    constructor(@Inject('CHANNEL_WRAPPER') private readonly channelWrapper: ChannelWrapper) {}

    /**
     * @param {string} queueName 
     * @param {any} data 
     * @returns {Promise<PromiseResolve>}
     * @memberof ProducerService
     * @description: Function to send data to the specified queue
     */

    async sendQueueServer(queue: string, data: any,correlationId:string): Promise<any> {
        try {
            console.log("hereeeeeserver");
            const send: boolean = await this.channelWrapper.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(data)),
                {
                    correlationId
                }
            )
        } catch (error: any) {
            Logger.error(error, 'Producer server error')
            throw new Error('Error in sending data to queue server');
        }
    }
}