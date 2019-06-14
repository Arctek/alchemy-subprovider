## Arctek/alchemy-subprovider

This project provides an Web3 Provider Engine-compatible provider for Alchemy and their Higher-level APIs.

This allows for emulating APIs on a local TestRPC/Ganache network.
This provider also hooks above providers such as MetaMask or mobile wallet providers, such that all read only data requests are done via Alchemy; while leaving signing and sending transactions to the wallet provider.

Instead of using the PassthroughSubprovider, you may also opt to use the SignerSubprovider[https://github.com/0xProject/0x-monorepo/blob/development/packages/subproviders/src/subproviders/signer.ts] from 0x.

## Testing

This is still to-do - however it wont be possible to write unit tests for MetaMask or mobile wallets (ex. Trust, Coinbase, imToken) as there is no way to automate this.