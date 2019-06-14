export declare type ErrorCallback = (err: Error | null, data?: any) => void;
export declare type Callback = () => void;
export interface AlchemyTokenAllowance {
    contractAddress: string;
    tokenBalance: string | null;
    error: string | null;
}
export interface AlchemyGetTokenBalancesResponse {
    address: string;
    tokenBalances: AlchemyTokenBalance[];
}
export interface AlchemyTokenBalance {
    contractAddress: string;
    tokenBalance: string | null;
    error: string | null;
}
export interface AlchemyGetTokenBalancesResponse {
    address: string;
    tokenBalances: AlchemyTokenBalance[];
}
//# sourceMappingURL=types.d.ts.map