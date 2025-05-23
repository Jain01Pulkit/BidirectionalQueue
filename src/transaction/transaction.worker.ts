import { BatchDto, BatchOperationDto } from '@gala-chain/api';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parentPort, workerData } from 'worker_threads';
import { threadId } from 'worker_threads';

const httpService = new HttpService();

async function processBatch(dtos: any) {
  // console.log(dtos, "dtos");
  // const batch: any = new BatchDto()
  // batch.operations = dtos
  // const res = await firstValueFrom(httpService.post("https://galachain-gateway-chain-platform-stage-chain-platform-eks.stage.galachain.com/api/asset/dexv3-contract/BatchSubmit", batch, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // }));

  // console.log(res?.data, "reponsefromBlockchain");
  // if (res?.data?.Status) {
  if (true) {
    // return res.data.Data.map((result: any, index: number) => ({
    //   uniqueId: dtos[index].uniqueId,
    //   result
    // }));
    return dtos.map((dto: any, index: number) => ({
      uniqueId: dto.uniqueId,
      result: {}, // Simulated result object
      status: 'processed'
    }));
    // return res.data.Data;
  } else {
    // return res?.data?.Error;
    // return dtos.map(dto => ({
    //   uniqueId: dto.uniqueId,
    //   result: res?.data?.Error || 'Unknown error'
    // }));
    return dtos.map(dto => ({
      uniqueId: dto.uniqueId,
      result: 'Unknown error',
      status: 'failed'
    }));
  }
}

async function executeTransactions(subArray: any, batchSize: number) {
  const operations = subArray.map((dto: any) => {
    const batchOperation = new BatchOperationDto();
    batchOperation.dto = dto.signedDto;
    batchOperation.method = dto.method;
    return { ...batchOperation, uniqueId: dto.uniqueId };
  });

  const result = await processBatch(operations);
  return subArray.map((dto: any, i: number) => ({
    uniqueId: dto.uniqueId,
    result: result[i]?.result,
    status: result[i]?.status,
    signature: dto.signedDto[0].signature,
  }));
}

(async () => {
  const { batch, batchSize } = workerData;
  const result = await executeTransactions(batch, batchSize);
  parentPort?.postMessage(result);
})();
