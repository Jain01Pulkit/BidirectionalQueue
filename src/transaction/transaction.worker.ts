import { parentPort, workerData } from 'worker_threads';

async function processBatch(batch: string[]) {
  return batch.map(tx => ({
      tx,
      status: 'success',
  }));
}

async function executeTransactions(subArray: string[], batchSize: number) {
  const results: any[] = [];
  
  for (let i = 0; i < subArray.length; i += batchSize) {
      const batch = subArray.slice(i, i + batchSize);      
      const batchResults = await processBatch(batch); 

      results.push(...batchResults);
      
      // await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

(async () => {
  const { batch, batchSize } = workerData;
  // console.log('Processing batch:', batch);
  const result = await executeTransactions(batch, batchSize);
  parentPort?.postMessage(result);
})();
