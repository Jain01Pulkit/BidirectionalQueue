import { BigNumberish, ChainCallDTO, TokenClassKey } from '@gala-chain/api';
import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Transaction, TransactionSchema } from 'src/models/transaction.model';
import { Client } from 'src/queue/rabbitMqClient/client';
import { input } from 'src/script';

@Controller('bundle')
export class BundlerController {
  constructor(
    private readonly clientQueue: Client,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
  ) { }
  /**
   * @description: Function to bundle the transactions and send the transaction
   * @returns {Promise<any>}
   * @memberof BundlerController
   */

  @Get()
  async bundleStrings() {

    let txResult;
    const idsMapping = new Map<string, string>();
    const idsInput = input.map((item: any) => {
      const uniqueId = randomUUID();
      item.uniqueId = uniqueId;
      idsMapping.set(uniqueId, item.signedDto.signature);
      return item;
    })
    const result = await this.transactionModel.insertMany(idsInput);
    if (!result.length) throw new Error("Insert failed");

    const insertedIds = result.map(r => r._id);
    const txnsInDB = await this.transactionModel.find({ _id: { $in: insertedIds } });

    if (txnsInDB?.length) {
      txResult = await this.clientQueue.produce(txnsInDB, 'transactionBundle');
    }
    if (txResult?.data?.length) {

      const updates = txResult.data.map((item: any) => ({
        updateOne: {
          filter: { uniqueId: item.uniqueId },
          update: {
            $set: {
              status: item.status,
            }
          }
        }
      }));

      if (updates.length) {
        await this.transactionModel.bulkWrite(updates);
      }
      return {
        data: txResult,
        message: "Response",
        error: false
      };
    }

    return {
      data: [],
      message: "No transactions found",
      error: true
    };
  }
}
