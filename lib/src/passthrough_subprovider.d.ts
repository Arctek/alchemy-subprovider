import { JSONRPCRequestPayload, Provider } from 'ethereum-types';
import { Callback, ErrorCallback } from './types';
import { Subprovider } from '@0x/subproviders';
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine)
 * subprovider interface.
 * It passes remaining requests down to the injected provider i.e. MetaMask or a mobile wallet provider.
 */
export declare class PassthroughSubprovider extends Subprovider {
    private readonly _provider;
    /**
     * Instantiates a new PassthroughSubprovider
     * @param provider Web3 provider that should handle all remaining requests, i.e. MetaMask
     */
    constructor(provider: Provider);
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
     * This method conforms to the provider sendAsync interface.
     * Allowing the PassthroughSubprovider to be used as a generic provider (outside of Web3ProviderEngine)
     * @param payload JSON RPC payload
     * @return The contents nested under the result key of the response body
     */
    sendAsync(payload: JSONRPCRequestPayload, callback: ErrorCallback): void;
}
//# sourceMappingURL=passthrough_subprovider.d.ts.map