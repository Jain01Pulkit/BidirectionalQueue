import { BigNumberish, ChainCallDTO, TokenClassKey } from '@gala-chain/api';
import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionSchema } from 'src/models/transaction.model';
import { Client } from 'src/queue/rabbitMqClient/client';

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
    class ADD_LIQUIDITY_DTO extends ChainCallDTO {
      public readonly token0: TokenClassKey;
      public readonly token1: TokenClassKey;
      public readonly fee: any;
      public readonly owner: string;
      public readonly tickLower: any;
      public readonly tickUpper: any;
      public readonly amount0Desired: BigNumberish;
      public readonly amount1Desired: BigNumberish;
      public readonly amount0Min: BigNumberish;
      public readonly amount1Min: BigNumberish;

      constructor(token0: TokenClassKey, token1: TokenClassKey, fee: any, owner: string,
        tickLower: any, tickUpper: any,
        amount0Desired: BigNumberish,
        amount1Desired: BigNumberish,
        amount0Min: BigNumberish,
        amount1Min: BigNumberish
      ) {
        super();
        this.token0 = token0;
        this.token1 = token1;
        this.fee = fee.toString();
        this.owner = owner;
        this.tickLower = tickLower.toString();
        this.tickUpper = tickUpper.toString();
        this.amount0Desired = amount0Desired;
        this.amount1Desired = amount1Desired;
        this.amount0Min = amount0Min;
        this.amount1Min = amount1Min;
      }
    }

    const tokenInstance0 = new TokenClassKey();
    tokenInstance0.additionalKey = 'none';
    tokenInstance0.category = 'Unit';
    tokenInstance0.type = 'none';
    tokenInstance0.collection = "GALA";

    const tokenInstance1 = new TokenClassKey();
    tokenInstance1.additionalKey = 'none';
    tokenInstance1.category = 'Unit';
    tokenInstance1.type = 'none';
    tokenInstance1.collection = "SILK";

    const tokenInstance2 = new TokenClassKey();
    tokenInstance2.additionalKey = 'client:6337024724eec8c292f0118d';
    tokenInstance2.category = 'Unit';
    tokenInstance2.type = 'ONEDEXT';
    tokenInstance2.collection = "Token";

    const poolString = `pool$${tokenInstance0.toStringKey()}$${tokenInstance1.toStringKey()}$3000`;
    const poolString2 = `pool$${tokenInstance0.toStringKey()}$${tokenInstance1.toStringKey()}$10000`;
    const userPositionString = `userPosition$$0x8E6C45330960819A3f789a939387776b9ed17291`;
    const tokenBalance0 = `tokenBalance$${tokenInstance0.toStringKey()}$0x8E6C45330960819A3f789a939387776b9ed17291`;
    const tokenBalance1 = `tokenBalance$${tokenInstance1.toStringKey()}$0x8E6C45330960819A3f789a939387776b9ed17291`;
    const tokenBalance2 = `tokenBalance$${tokenInstance2.toStringKey()}$0x8E6C45330960819A3f789a939387776b9ed17291`;
    const tokenBalance0Pool = `tokenBalance$${tokenInstance0.toStringKey()}$${poolString}`;
    const tokenBalance1Pool = `tokenBalance$${tokenInstance1.toStringKey()}$${poolString}`;
    const tokenBalance2Pool = `tokenBalance$${tokenInstance2.toStringKey()}$${poolString}`;


    let addLiquidityDTO1 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance1,
      Number(3000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO1.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto = addLiquidityDTO1;

    let addLiquidityDTO2 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance2,
      Number(10000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO2.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto1 = addLiquidityDTO2;


    let addLiquidityDTO3 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance1,
      Number(3000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO3.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto3 = addLiquidityDTO3;

    let addLiquidityDTO4 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance2,
      Number(10000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO4.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto4 = addLiquidityDTO4;

    let addLiquidityDTO5 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance1,
      Number(3000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO5.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto5 = addLiquidityDTO5;

    let addLiquidityDTO6 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance2,
      Number(10000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO6.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto6 = addLiquidityDTO6;

    let addLiquidityDTO7 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance1,
      Number(3000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO7.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDt07 = addLiquidityDTO7;

    let addLiquidityDTO8 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance2,
      Number(10000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO8.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDt08 = addLiquidityDTO8;

    let addLiquidityDTO9 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance1,
      Number(3000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO9.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto9 = addLiquidityDTO9;

    let addLiquidityDTO10 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance2,
      Number(10000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO10.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto10 = addLiquidityDTO10;

    let addLiquidityDTO11 = new ADD_LIQUIDITY_DTO(
      tokenInstance0,
      tokenInstance1,
      Number(3000),
      "0x8E6C45330960819A3f789a939387776b9ed17291",
      -886800,
      886800,
      ("0.1"),
      ("0.01"),
      ("0"),
      ("0")
    );
    addLiquidityDTO11.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
    const signedDto11 = addLiquidityDTO11;

    const input = [{
      stringsInstructions: [poolString, userPositionString, tokenBalance0, tokenBalance1, tokenBalance0Pool, tokenBalance1Pool],
      signedDto,
      method: 'AddLiquidity',
      uniqueId: 1,
      status: "pending"
    }, {
      stringsInstructions: [poolString2, userPositionString, tokenBalance0, tokenBalance2, tokenBalance0Pool, tokenBalance2Pool],
      signedDto: signedDto1,
      method: 'AddLiquidity',
      uniqueId: 2,
      status: "pending"
    },
    {
      stringsInstructions: [poolString, userPositionString, tokenBalance0, tokenBalance1, tokenBalance0Pool, tokenBalance1Pool],
      signedDto: signedDto3,
      method: 'AddLiquidity',
      uniqueId: 3,
      status: "pending"
    },
    {
      stringsInstructions: [poolString2, userPositionString, tokenBalance0, tokenBalance2, tokenBalance0Pool, tokenBalance2Pool],
      signedDto: signedDto4,
      method: 'AddLiquidity',
      uniqueId: 4,
      status: "pending"
    },
    {
      stringsInstructions: [poolString, userPositionString, tokenBalance0, tokenBalance1, tokenBalance0Pool, tokenBalance1Pool],
      signedDto: signedDto5,
      method: 'AddLiquidity',
      uniqueId: 5,
      status: "pending"
    },
    {
      stringsInstructions: [poolString2, userPositionString, tokenBalance0, tokenBalance2, tokenBalance0Pool, tokenBalance2Pool],
      signedDto: signedDto6,
      method: 'AddLiquidity',
      uniqueId: 6,
      status: "pending"
    },
    {
      stringsInstructions: [poolString, userPositionString, tokenBalance0, tokenBalance1, tokenBalance1Pool, tokenBalance2Pool],
      signedDto: signedDt07,
      method: 'AddLiquidity',
      uniqueId: 7,
      status: "pending"
    },
    {
      stringsInstructions: [poolString2, userPositionString, tokenBalance0, tokenBalance2, tokenBalance0Pool, tokenBalance2Pool],
      signedDto: signedDt08,
      method: 'AddLiquidity',
      uniqueId: 8,
      status: "pending"
    },
    {
      stringsInstructions: [poolString, userPositionString, tokenBalance0, tokenBalance1, tokenBalance0Pool, tokenBalance1Pool],
      signedDto: signedDto9,
      method: 'AddLiquidity',
      uniqueId: 9,
      status: "pending"
    },
    {
      stringsInstructions: [poolString2, userPositionString, tokenBalance0, tokenBalance2, tokenBalance0Pool, tokenBalance2Pool],
      signedDto: signedDto10,
      method: 'AddLiquidity',
      uniqueId: 10,
      status: "pending"
    },
    {
      stringsInstructions: [poolString, userPositionString, tokenBalance0, tokenBalance1, tokenBalance0Pool, tokenBalance1Pool],
      signedDto: signedDto11,
      method: 'AddLiquidity',
      uniqueId: 11,
      status: "pending"
    }];
    let txResult;
    const result = await this.transactionModel.create(input);
    if (result.length) {
      console.log("Transaction created successfully");
      const txnsInDB = await this.transactionModel.find({});
      if (txnsInDB?.length) {
        txResult = await this.clientQueue.produce(txnsInDB, 'transactionBundle');
      }
    }
    return txResult;
  }
}
