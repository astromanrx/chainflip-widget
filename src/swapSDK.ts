import { SwapSDK, SwapSDKOptions } from "@chainflip/sdk/swap";

const options: SwapSDKOptions = {
    network: "mainnet", // Testnet
    // backendServiceUrl: "https://example.chainflip.io",
    signer: undefined/*Wallet.fromMnemonic(process.env.WALLET_MNEMONIC)*/,
    broker: {
      url: 'https://my.broker.io',
      commissionBps: 0, // basis points, i.e. 100 = 1%
    },
  };
  const swapSDK = new SwapSDK(options);

  export {swapSDK}