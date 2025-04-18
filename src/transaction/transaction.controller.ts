import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('process')
  async processTransactions(@Body() body: { data: string[][] }) {
    // return this.transactionService.processInBatches(body.data);
  }
}
