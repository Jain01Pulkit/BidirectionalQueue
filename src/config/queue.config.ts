import { registerAs } from '@nestjs/config';

export default registerAs<any>('queue', ():{ url: any, transactionBundle: string } => {
    return {
        url: process.env.QUEUE_URL || ['amqp://guest:guest@127.0.0.1'],
        transactionBundle: process.env.DEX_TRADE_QUEUE || 'transactionBundle',
    }
})