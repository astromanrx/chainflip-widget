import { SwapSDK, SwapSDKOptions } from "@chainflip/sdk/swap";
import { useMemo } from "react";
import { useEthersSigner } from "./useEthersSigner";

const useSwapSDK = ()=>{
  const signer = useEthersSigner()  

  const options: SwapSDKOptions = {
    network: "mainnet", // Testnet
    // backendServiceUrl: "https://example.chainflip.io",
    signer: signer  /*Wallet.fromMnemonic(process.env.WALLET_MNEMONIC)*/,
    broker: {
      url: 'https://my.broker.io',
      commissionBps: 0, // basis points, i.e. 100 = 1%
    },
  };
  const swapSDK = useMemo(()=>new SwapSDK(options),[signer]) ;
  
  return swapSDK;

}

  export {useSwapSDK}