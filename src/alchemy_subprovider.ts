import { assert } from '@0x/assert';
import { fetchAsync } from '@0x/utils';
import { JSONRPCRequestPayload } from 'ethereum-types';
import { Callback, ErrorCallback, AlchemyGetTokenBalancesResponse, AlchemyTokenBalance } from './types';
import { Subprovider } from '@0x/subproviders';
import { StatusCodes } from '@0x/types';
import JsonRpcError = require('json-rpc-error');
import BigNumber from "bignumber.js";

/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine)
 * subprovider interface.
 * It handles all requests except accounts, signing and transactions through to Alchemy.
 * This is useful for wrapping MetaMask and mobile wallet providers.
 * It also supports emulating Alchemy High-level API features over a TestRPC / Ganache network.
 */
export class AlchemySubprovider extends Subprovider {
    private readonly _alchemyRpcUrl: string;
    private readonly _requestTimeoutMs: number;
    private readonly _isTestRPC: boolean;
    /**
     * Instantiates a new AlchemySubprovider
     * @param alchemyRpcUrl URL to the backing Ethereum node to which JSON RPC requests should be sent
     * @param requestTimeoutMs Amount of miliseconds to wait before timing out the JSON RPC request
     * @param isTestRPC The current network is a TestRPC / Ganache network
     */
    constructor(alchemyRpcUrl: string, requestTimeoutMs: number = 20000, isTestRPC = false) {
        super();
        assert.isString('alchemyRpcUrl', alchemyRpcUrl);
        assert.isNumber('requestTimeoutMs', requestTimeoutMs);
        assert.isBoolean('isTestRPC', isTestRPC);
        this._alchemyRpcUrl = alchemyRpcUrl;
        this._requestTimeoutMs = requestTimeoutMs;
        this._isTestRPC = isTestRPC;
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
    public async handleRequest(payload: JSONRPCRequestPayload, next: Callback, end: ErrorCallback): Promise<void> {
        switch (payload.method) {
            case 'eth_accounts':
            case 'eth_sign':
            case 'eth_signTypedData':
            case 'eth_signTypedData_v3':
            case 'eth_sendTransaction':
            case 'eth_sendRawTransaction':
            case 'personal_sign':
            case 'web3_clientVersion':
                next();
                return;
            
            case 'alchemy_getTokenAllowance':
                if (this._isTestRPC) {
                    return await this._emulateAlchemyGetTokenAllowance(payload, end);
                }

            case 'alchemy_getTokenBalances':
                if (this._isTestRPC) {
                    return await this._emulateAlchemyGetTokenBalances(payload, end);
                }

            case 'alchemy_getTokenMetadata':
                if (this._isTestRPC) {
                    return await this._emulateAlchemyGetTokenMetadata(payload, end);
                }

            default:
                try {
                    end(null, await this._doAlchemyRequest(payload));
                } catch (err) {
                    end(err);
                }
        }
    }
    /**
     * This method handles a RPC payload through to Alchemy.
     * @param payload JSON RPC payload
     */
    private async _doAlchemyRequest(payload: JSONRPCRequestPayload): Promise<any> {
        const finalPayload = Subprovider._createFinalPayload(payload);
        const headers = new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
        });

        let response;
        try {
            response = await fetchAsync(
                this._alchemyRpcUrl,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(finalPayload),
                },
                this._requestTimeoutMs
            );
        } catch (err) {
            throw new JsonRpcError.InternalError(err);
        }

        const text = await response.text();
        if (!response.ok) {
            const statusCode = response.status;
            switch (statusCode) {
                case StatusCodes.MethodNotAllowed:
                    throw new JsonRpcError.MethodNotFound();
                case StatusCodes.GatewayTimeout:
                    const errMsg =
                        'Gateway timeout. The request took too long to process.';
                    const err = new Error(errMsg);
                    throw new JsonRpcError.InternalError(err);
                default:
                    throw new JsonRpcError.InternalError(text);
            }
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            throw new JsonRpcError.InternalError(err);
        }

        if (data.error) {
            throw data.error;
        }
        
        return data.result;
    }

    /**
     * This method emulates getTokenAllowance API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    private async _emulateAlchemyGetTokenAllowance(payload: JSONRPCRequestPayload, end: ErrorCallback) {
        const [contract, owner, spender] = payload.params;

        const emmulatedPayload: JSONRPCRequestPayload = {
           jsonrpc: "2.0",
           method: "eth_call",
           params: [{
               to: contract,
               data: "0xdd62ed3e000000000000000000000000" + owner.substring(2).toLowerCase().padStart() + "000000000000000000000000" + spender.substring(2).toLowerCase()
           }],
           id: 0
        }
        
        try {
            end(null, await this._doAlchemyRequest(emmulatedPayload));
        } catch (err) {
            end(err, null);
        }        
    }

    /**
     * This method emulates getTokenBalances API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    private async _emulateAlchemyGetTokenBalances(payload: JSONRPCRequestPayload, end: ErrorCallback) {
        // Check each token contract sequentially for balances and return
        const [address, tokenAddresses] = payload.params;

        let results: AlchemyGetTokenBalancesResponse = {
            address: address,
            tokenBalances: []
        };

        for (let i = 0; i < tokenAddresses.length; i++) {
            // This is the 4 byte ABI definition for balanceOf() call
            let currentPayload: JSONRPCRequestPayload = {
               jsonrpc: "2.0",
               method: "eth_call",
               params: [{
                   to: tokenAddresses[i],
                   data: "0x70a08231000000000000000000000000" + address.substring(2).toLowerCase()
               }],
               id: i
            }

            try {
                let result: string = await this._doAlchemyRequest(currentPayload);

                results.tokenBalances[i] = {
                    contractAddress: tokenAddresses[i],
                    tokenBalance: result,
                    error: null
                };
            } catch (err) {
                results.tokenBalances[i] = {
                    contractAddress: tokenAddresses[i],
                    tokenBalance: null,
                    error: err.toString()
                };
            }
        }

        end(null, results);
    }

    /**
     * This method emulates getTokenMetadata API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    private async _emulateAlchemyGetTokenMetadata(payload: JSONRPCRequestPayload, end: ErrorCallback) {
        const [contract] = payload.params;
        
        try {
            const symbol = await this._doAlchemyRequest({
                jsonrpc: "2.0",
                method: "eth_call",
                params: [{
                    to: contract,
                    data: "0x95d89b41000000000000000000000000"
                }],
                id: 0
            });

            const decimals = await this._doAlchemyRequest({
                jsonrpc: "2.0",
                method: "eth_call",
                params: [{
                    to: contract,
                    data: "0x313ce567000000000000000000000000"
                }],
                id: 1
            });

            const name = await this._doAlchemyRequest({
                jsonrpc: "2.0",
                method: "eth_call",
                params: [{
                    to: contract,
                    data: "0x06fdde03000000000000000000000000"
                }],
                id: 2
            });

            let niceSymbol;
            let niceName;

            if (symbol.length == 194) {
                const length = new BigNumber("0x" + symbol.substr(128, 2)).toNumber();
                niceSymbol = new Buffer(symbol.substr(130, length * 2), 'hex').toString('utf8');
            }

            if (name.length == 194) {
                const length = new BigNumber("0x" + name.substr(128, 2)).toNumber();
                niceName = new Buffer(name.substr(130, length * 2), 'hex').toString('utf8');
            }

            end(null, {
                logo: "https://static.alchemyapi.io/images/assets/1.png",
                symbol: niceSymbol,
                decimals: new BigNumber(decimals).toNumber(),
                name: niceName
            });

        } catch (err) {
            end(err, null);
        }        
    }
}
