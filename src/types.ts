export type ErrorCallback = (err: Error | null, data?: any) => void;
export type Callback = () => void;

export interface AlchemyTokenAllowance {
    contractAddress: string,
    tokenBalance: string | null,
    error: string | null
}

export interface AlchemyGetTokenBalancesResponse {
    address: string,
    tokenBalances: AlchemyTokenBalance[]
}

export interface AlchemyTokenBalance {
    contractAddress: string,
    tokenBalance: string | null,
    error: string | null
}

export interface AlchemyGetTokenBalancesResponse {
    address: string,
    tokenBalances: AlchemyTokenBalance[]
}