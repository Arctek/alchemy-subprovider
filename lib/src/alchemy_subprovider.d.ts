import { JSONRPCRequestPayload } from 'ethereum-types';
import { Callback, ErrorCallback } from './types';
import { Subprovider } from '@0x/subproviders';
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine)
 * subprovider interface.
 * It handles all requests except accounts, signing and transactions through to Alchemy.
 * This is useful for wrapping MetaMask and mobile wallet providers.
 * It also supports emulating Alchemy High-level API features over a TestRPC / Ganache network.
 */
export declare class AlchemySubprovider extends Subprovider {
    private readonly _alchemyRpcUrl;
    private readonly _requestTimeoutMs;
    private readonly _isTestRPC;
    /**
     * Instantiates a new AlchemySubprovider
     * @param alchemyRpcUrl URL to the backing Ethereum node to which JSON RPC requests should be sent
     * @param requestTimeoutMs Amount of miliseconds to wait before timing out the JSON RPC request
     * @param isTestRPC The current network is a TestRPC / Ganache network
     */
    constructor(alchemyRpcUrl: string, requestTimeoutMs?: number, isTestRPC?: boolean);
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    handleRequest(payload: JSONRPCRequestPayload, next: Callback, end: ErrorCallback): Promise<void>;
    /**
     * This method handles a RPC payload through to Alchemy.
     * @param payload JSON RPC payload
     */
    private _doAlchemyRequest;
    /**
     * This method emulates getTokenAllowance API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    private _emulateAlchemyGetTokenAllowance;
    /**
     * This method emulates getTokenBalances API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    private _emulateAlchemyGetTokenBalances;
    /**
     * This method emulates getTokenMetadata API offered by Alchemy.
     * @param payload JSON RPC payload
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    private _emulateAlchemyGetTokenMetadata;
}
//# sourceMappingURL=alchemy_subprovider.d.ts.map