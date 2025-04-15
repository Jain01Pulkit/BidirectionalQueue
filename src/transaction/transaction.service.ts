import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';

@Injectable()
export class TransactionService {
  async processInBatches(data: string[][], batchSize = 10) {
    const results:any = [];
    console.log('data', data);
    const workerPromises = data.map((batch,index) =>
      new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'transaction.worker.js'), {
          workerData: {batch,batchSize},
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
      })
    );

    const workerResults = await Promise.all(workerPromises);
    workerResults.forEach((res:any) => results.push(...res));

    return results;
  }
}
