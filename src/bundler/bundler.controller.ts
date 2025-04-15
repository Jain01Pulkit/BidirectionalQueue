import { Controller, Get } from '@nestjs/common';
import { BundlerService } from './bundler.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Client } from 'src/queue/rabbitMqClient/client';

@Controller('bundle')
export class BundlerController {
  constructor(
    private readonly clientQueue: Client
  ) { }

  @Get()
  async bundleStrings() {
    const input = ["ABC", "ACD", "ABE", "XYZ", "PQX", "PQZ", "MNP", "QWE", "III", "OOO", "PPP", "XXX", "GGG", "SSS", "TTT", "VVV", "FFF", "HHH", "JJJ", "KKK", 
    "LLL", "UUU", "RRR","ABC", "ACD", "ABE", "XYZ", "PQX", "PQZ", "MNP", "QWE", "III", "OOO", "PPP", "XXX", "GGG", "SSS", "TTT", "VVV", "FFF", "HHH", "JJJ",
    "KKK", "LLL", "UUU", "RRR"];
    // const result = this.bundlerService.generateBundle(input);
    // const reussss = await this.transactionService.processInBatches(result, 10);
    const reussss = await this.clientQueue.produce("abra ka dabra",'transactionBundle');
    console.log('reussss', reussss);
    return reussss;
  }
}
