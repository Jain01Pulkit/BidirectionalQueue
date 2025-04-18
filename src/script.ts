import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { BatchDto, BatchOperationDto, BigNumberish, ChainCallDTO, TokenClassKey } from "@gala-chain/api";

const httpService = new HttpService();

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

export const generateDTOAndStringsForAddLiquidity = async () => {
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

    const poolString = `pool$${tokenInstance0.toStringKey()}$${tokenInstance1.toStringKey()}$3000`;
    const userPositionString = `userPosition$$0x8E6C45330960819A3f789a939387776b9ed17291`;
    const tokenBalance0 = `tokenBalance$${tokenInstance0.toStringKey()}$0x8E6C45330960819A3f789a939387776b9ed17291`;
    const tokenBalance1 = `tokenBalance$${tokenInstance1.toStringKey()}$0x8E6C45330960819A3f789a939387776b9ed17291`;
    const tokenBalance0Pool = `tokenBalance$${tokenInstance0.toStringKey()}$${poolString}`;
    const tokenBalance1Pool = `tokenBalance$${tokenInstance1.toStringKey()}$${poolString}`;

    let addLiquidityDTO1 = new ADD_LIQUIDITY_DTO(
        tokenInstance0,
        tokenInstance1,
        Number(3000),
        "0x8E6C45330960819A3f789a939387776b9ed17291",
        -886800,
        886800,
        ("0.01"),
        ("0.001"),
        ("0"),
        ("0")
    );
    let addLiquidityDTO2 = new ADD_LIQUIDITY_DTO(
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
    addLiquidityDTO2.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");

    const batchOperation = new BatchOperationDto()
    const batchOperation2 = new BatchOperationDto()

    batchOperation.dto = addLiquidityDTO1
    batchOperation2.dto = addLiquidityDTO2
    batchOperation.method = "AddLiquidity"
    batchOperation2.method = "AddLiquidity"

    const batch = new BatchDto()
    batch.operations = [batchOperation,batchOperation2]

    const res = await firstValueFrom(httpService.post("https://galachain-gateway-chain-platform-stage-chain-platform-eks.stage.galachain.com/api/asset/dexv3-contract/BatchSubmit", batch, {
        headers: {
            'Content-Type': 'application/json',
        },
    }));

}

// generateDTOAndStringsForAddLiquidity();