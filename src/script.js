"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDTOAndStringsForAddLiquidity = void 0;
var rxjs_1 = require("rxjs");
var axios_1 = require("@nestjs/axios");
var api_1 = require("@gala-chain/api");
var httpService = new axios_1.HttpService();
var ADD_LIQUIDITY_DTO = /** @class */ (function (_super) {
    __extends(ADD_LIQUIDITY_DTO, _super);
    function ADD_LIQUIDITY_DTO(token0, token1, fee, owner, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min) {
        var _this = _super.call(this) || this;
        _this.token0 = token0;
        _this.token1 = token1;
        _this.fee = fee.toString();
        _this.owner = owner;
        _this.tickLower = tickLower.toString();
        _this.tickUpper = tickUpper.toString();
        _this.amount0Desired = amount0Desired;
        _this.amount1Desired = amount1Desired;
        _this.amount0Min = amount0Min;
        _this.amount1Min = amount1Min;
        return _this;
    }
    return ADD_LIQUIDITY_DTO;
}(api_1.ChainCallDTO));
var generateDTOAndStringsForAddLiquidity = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tokenInstance0, tokenInstance1, poolString, userPositionString, tokenBalance0, tokenBalance1, tokenBalance0Pool, tokenBalance1Pool, addLiquidityDTO, batchOperation, batch, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenInstance0 = new api_1.TokenClassKey();
                tokenInstance0.additionalKey = 'none';
                tokenInstance0.category = 'Unit';
                tokenInstance0.type = 'none';
                tokenInstance0.collection = "GALA";
                tokenInstance1 = new api_1.TokenClassKey();
                tokenInstance1.additionalKey = 'none';
                tokenInstance1.category = 'Unit';
                tokenInstance1.type = 'none';
                tokenInstance1.collection = "SILK";
                poolString = "pool$".concat(tokenInstance0.toStringKey(), "$").concat(tokenInstance1.toStringKey(), "$3000");
                userPositionString = "userPosition$$0x8E6C45330960819A3f789a939387776b9ed17291";
                tokenBalance0 = "tokenBalance$".concat(tokenInstance0.toStringKey(), "$0x8E6C45330960819A3f789a939387776b9ed17291");
                tokenBalance1 = "tokenBalance$".concat(tokenInstance1.toStringKey(), "$0x8E6C45330960819A3f789a939387776b9ed17291");
                tokenBalance0Pool = "tokenBalance$".concat(tokenInstance0.toStringKey(), "$").concat(poolString);
                tokenBalance1Pool = "tokenBalance$".concat(tokenInstance1.toStringKey(), "$").concat(poolString);
                addLiquidityDTO = new ADD_LIQUIDITY_DTO(tokenInstance0, tokenInstance1, Number(3000), "0x8E6C45330960819A3f789a939387776b9ed17291", -886800, 886800, 1, 5, 0, 0);
                addLiquidityDTO.sign("d81b8b738279484a1fb9f494e2a5f6bd55203fe63f02d6f85203e973977790a7");
                batchOperation = new api_1.BatchOperationDto();
                batchOperation.dto = addLiquidityDTO;
                batchOperation.method = "AddLiquidity";
                batch = new api_1.BatchDto();
                batch.operations.push(batchOperation);
                return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(httpService.post("https://galachain-gateway-chain-platform-stage-chain-platform-eks.stage.galachain.com/api/asset/dexv3-contract/BatchSubmit", batch, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }))];
            case 1:
                res = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.generateDTOAndStringsForAddLiquidity = generateDTOAndStringsForAddLiquidity;
(0, exports.generateDTOAndStringsForAddLiquidity)();
