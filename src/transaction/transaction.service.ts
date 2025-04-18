import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';
type BundleOutput = {
  signedInstructions: string[];
  dtos: { signedDto: string, method: string }[];
};

@Injectable()
export class TransactionService {
  modifyIntoBatchOfTen<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  async processInBatches(data: BundleOutput[], batchSize = 10) {
    const results: any = [];
    const pendingResponses = new Map<number, (result: any) => void>();
    const batches = this.modifyIntoBatchOfTen(data.flatMap(bundle => bundle.dtos), batchSize);
    const workerPromises = batches.map((batch, index) =>
      new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'transaction.worker.js'), {
          workerData: { batch, batchSize },
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
