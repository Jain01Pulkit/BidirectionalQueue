import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';
import { Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid'; // For correlation IDs
import { EventEmitter } from 'events';
@Injectable()
export class ProducerService {
    constructor(@Inject('CHANNEL_WRAPPER') private channelWrapper:ChannelWrapper, @Inject('QUEUE_NAME') private queueName:string,@Inject('eventEmitter') private eventEmitter: EventEmitter) {
        const connection: IAmqpConnectionManager = amqp.connect(this.queueName);
        // this.channelWrapper = connection.createChannel({
        //     setup: async (channel: Channel) => {
        //         await channel.assertQueue("transactionBundle", { durable: true });       /// TODO: add queue name from config
        //     }      
        // })
    }

    /**
     * @param {string} queueName 
     * @param {any} data 
     * @returns {Promise<PromiseResolve>}
     * @memberof ProducerService
     * @description: Function to send data to the specified queue
     */

    async sendQueue(queueName: string, data: any,correlationId?:string): Promise<any> {
        try {
            const send: boolean = await this.channelWrapper.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(data)),
                {
                    replyTo:this.queueName,correlationId,
                    persistent: true
                }
            )
            this?.eventEmitter?.setMaxListeners(0);
            console.log("succesfully sent",send,this.queueName, correlationId);
            if(!send) throw new Error('Error in sending data to queue');
            const response = await Promise.race([
                new Promise((resolve, reject) => {
                    this.eventEmitter.once(correlationId as any, (msg: any) => {
                      console.log("akjsssss=-sad=ap-d-apdsa=d-")
                    const reply = JSON.parse(msg.content.toString());
                    if (!reply) return reject(new Error('Empty reply'));
                    resolve(reply);
                  });
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('RPC timeout')), 5000))
              ]);
            console.log('response', response);
            // return {
            //     status: 200,
            //     error: false,
            //     message: 'Data sent successfully'
            // }
        } catch (error: any) {
            Logger.error(error, 'sendQueue error')

            // return {
            //     status: 404,
            //     error: true,
            //     message: error?.message
            // }
        }
    }
}