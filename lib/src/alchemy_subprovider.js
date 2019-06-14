"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("@0x/assert");
var utils_1 = require("@0x/utils");
var subproviders_1 = require("@0x/subproviders");
var types_1 = require("@0x/types");
var JsonRpcError = require("json-rpc-error");
var bignumber_js_1 = require("bignumber.js");
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine)
 * subprovider interface.
 * It handles all requests except accounts, signing and transactions through to Alchemy.
 * This is useful for wrapping MetaMask and mobile wallet providers.
 * It also supports emulating Alchemy High-level API features over a TestRPC / Ganache network.
 */
var AlchemySubprovider = /** @class */ (function (_super) {
    __extends(AlchemySubprovider, _super);
    /**
     * Instantiates a new AlchemySubprovider
     * @param alchemyRpcUrl URL to the backing Ethereum node to which JSON RPC requests should be sent
     * @param requestTimeoutMs Amount of miliseconds to wait before timing out the JSON RPC request
     * @param isTestRPC The current network is a TestRPC / Ganache network
     */
    function AlchemySubprovider(alchemyRpcUrl, requestTimeoutMs, isTestRPC) {
        if (requestTimeoutMs === void 0) { requestTimeoutMs = 20000; }
        if (isTestRPC === void 0) { isTestRPC = false; }
        var _this = _super.call(this) || this;
        assert_1.assert.isString('alchemyRpcUrl', alchemyRpcUrl);
        assert_1.assert.isNumber('requestTimeoutMs', requestTimeoutMs);
        assert_1.assert.isBoolean('isTestRPC', isTestRPC);
        _this._alchemyRpcUrl = alchemyRpcUrl;
        _this._requestTimeoutMs = requestTimeoutMs;
        _this._isTestRPC = isTestRPC;
        return _this;
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:prefer-function-over-method async-suffix
    AlchemySubprovider.prototype.handleRequest = function (payload, next, end) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = payload.method;
                        switch (_a) {
                            case 'eth_accounts': return [3 /*break*/, 1];
                            case 'eth_sign': return [3 /*break*/, 1];
                            case 'eth_signTypedData': return [3 /*break*/, 1];
                            case 'eth_signTypedData_v3': return [3 /*break*/, 1];
                            case 'eth_sendTransaction': return [3 /*break*/, 1];
                            case 'eth_sendRawTransaction': return [3 /*break*/, 1];
                            case 'personal_sign': return [3 /*break*/, 1];
                            case 'web3_clientVersion': return [3 /*break*/, 1];
                            case 'alchemy_getTokenAllowance': return [3 /*break*/, 2];
                            case 'alchemy_getTokenBalances': return [3 /*break*/, 4];
                            case 'alchemy_getTokenMetadata': return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 1:
                        next();
                        return [2 /*return*/];
                    case 2:
                        if (!this._isTestRPC) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._emulateAlchemyGetTokenAllowance(payload, end)];
                    case 3: return [2 /*return*/, _d.sent()];
                    case 4:
                        if (!this._isTestRPC) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._emulateAlchemyGetTokenBalances(payload, end)];
                    case 5: return [2 /*return*/, _d.sent()];
                    case 6:
                        if (!this._isTestRPC) return [3 /*break*/, 8];
                        return [4 /*yield*/, this._emulateAlchemyGetTokenMetadata(payload, end)];
                    case 7: return [2 /*return*/, _d.sent()];
                    case 8:
                        _d.trys.push([8, 10, , 11]);
                        _b = end;
                        _c = [null];
                        return [4 /*yield*/, this._doAlchemyRequest(payload)];
                    case 9:
                        _b.apply(void 0, _c.concat([_d.sent()]));
                        return [3 /*break*/, 11];
                    case 10:
                        err_1 = _d.sent();
                        end(err_1);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This method handles a RPC payload through to Alchemy.
     * @param payload JSON RPC payload
     */
    AlchemySubprovider.prototype._doAlchemyRequest = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var finalPayload, headers, response, err_2, text, statusCode, errMsg, err, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        finalPayload = subproviders_1.Subprovider._createFinalPayload(payload);
                        headers = new Headers({
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, utils_1.fetchAsync(this._alchemyRpcUrl, {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify(finalPayload),
                            }, this._requestTimeoutMs)];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        throw new JsonRpcError.InternalError(err_2);
                    case 4: return [4 /*yield*/, response.text()];
                    case 5:
                        text = _a.sent();
                        if (!response.ok) {
                            statusCode = response.status;
                            switch (statusCode) {
                                case types_1.StatusCodes.MethodNotAllowed:
                                    throw new JsonRpcError.MethodNotFound();
                                case types_1.StatusCodes.GatewayTimeout:
                                    errMsg = 'Gateway timeout. The request took too long to process.';
                                    err = new Error(errMsg);
                                    throw new JsonRpcError.InternalError(err);
                                default:
                                    throw new JsonRpcError.InternalError(text);
                            }
                        }
                        try {
                            data = JSON.parse(text);
                        }
                        catch (err) {
                            throw new JsonRpcError.InternalError(err);
                        }
                        if (data.error) {
                            throw data.error;
                        }
                        return [2 /*return*/, data.result];
                }
            });
        });
    };
    /**
     * This method emulates getTokenAllowance API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    AlchemySubprovider.prototype._emulateAlchemyGetTokenAllowance = function (payload, end) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, contract, owner, spender, emmulatedPayload, _b, _c, err_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = __read(payload.params, 3), contract = _a[0], owner = _a[1], spender = _a[2];
                        emmulatedPayload = {
                            jsonrpc: "2.0",
                            method: "eth_call",
                            params: [{
                                    to: contract,
                                    data: "0xdd62ed3e000000000000000000000000" + owner.substring(2).toLowerCase().padStart() + "000000000000000000000000" + spender.substring(2).toLowerCase()
                                }],
                            id: 0
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        _b = end;
                        _c = [null];
                        return [4 /*yield*/, this._doAlchemyRequest(emmulatedPayload)];
                    case 2:
                        _b.apply(void 0, _c.concat([_d.sent()]));
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _d.sent();
                        end(err_3, null);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This method emulates getTokenBalances API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    AlchemySubprovider.prototype._emulateAlchemyGetTokenBalances = function (payload, end) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, address, tokenAddresses, results, i, currentPayload, result, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(payload.params, 2), address = _a[0], tokenAddresses = _a[1];
                        results = {
                            address: address,
                            tokenBalances: []
                        };
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < tokenAddresses.length)) return [3 /*break*/, 6];
                        currentPayload = {
                            jsonrpc: "2.0",
                            method: "eth_call",
                            params: [{
                                    to: tokenAddresses[i],
                                    data: "0x70a08231000000000000000000000000" + address.substring(2).toLowerCase()
                                }],
                            id: i
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._doAlchemyRequest(currentPayload)];
                    case 3:
                        result = _b.sent();
                        results.tokenBalances[i] = {
                            contractAddress: tokenAddresses[i],
                            tokenBalance: result,
                            error: null
                        };
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _b.sent();
                        results.tokenBalances[i] = {
                            contractAddress: tokenAddresses[i],
                            tokenBalance: null,
                            error: err_4.toString()
                        };
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        end(null, results);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This method emulates getTokenMetadata API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    AlchemySubprovider.prototype._emulateAlchemyGetTokenMetadata = function (payload, end) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, contract, symbol, decimals, name_1, niceSymbol, niceName, length_1, length_2, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(payload.params, 1), contract = _a[0];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this._doAlchemyRequest({
                                jsonrpc: "2.0",
                                method: "eth_call",
                                params: [{
                                        to: contract,
                                        data: "0x95d89b41000000000000000000000000"
                                    }],
                                id: 0
                            })];
                    case 2:
                        symbol = _b.sent();
                        return [4 /*yield*/, this._doAlchemyRequest({
                                jsonrpc: "2.0",
                                method: "eth_call",
                                params: [{
                                        to: contract,
                                        data: "0x313ce567000000000000000000000000"
                                    }],
                                id: 1
                            })];
                    case 3:
                        decimals = _b.sent();
                        return [4 /*yield*/, this._doAlchemyRequest({
                                jsonrpc: "2.0",
                                method: "eth_call",
                                params: [{
                                        to: contract,
                                        data: "0x06fdde03000000000000000000000000"
                                    }],
                                id: 2
                            })];
                    case 4:
                        name_1 = _b.sent();
                        niceSymbol = void 0;
                        niceName = void 0;
                        if (symbol.length == 194) {
                            length_1 = new bignumber_js_1.default("0x" + symbol.substr(128, 2)).toNumber();
                            niceSymbol = new Buffer(symbol.substr(130, length_1 * 2), 'hex').toString('utf8');
                        }
                        if (name_1.length == 194) {
                            length_2 = new bignumber_js_1.default("0x" + name_1.substr(128, 2)).toNumber();
                            niceName = new Buffer(name_1.substr(130, length_2 * 2), 'hex').toString('utf8');
                        }
                        end(null, {
                            logo: "https://static.alchemyapi.io/images/assets/1.png",
                            symbol: niceSymbol,
                            decimals: new bignumber_js_1.default(decimals).toNumber(),
                            name: niceName
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        err_5 = _b.sent();
                        end(err_5, null);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AlchemySubprovider;
}(subproviders_1.Subprovider));
exports.AlchemySubprovider = AlchemySubprovider;
//# sourceMappingURL=alchemy_subprovider.js.map