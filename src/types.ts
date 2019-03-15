export type ErrorCallback = (err: Error | null, data?: any) => void;
export type Callback = () => void;

export interface AlchemyGetTokenBalancesResponse {
    address: string,
    tokenBalances: {
        contractAddress: string,
        tokenBalance: string,
        error: string | null
    }[]
}