import { AssetData, Chain } from "@chainflip/sdk/swap";
import { ethers, JsonRpcProvider } from "ethers";
import { useAccount } from "wagmi";

export const applyDecimal = (amount: number, token: AssetData): bigint => {
  // return ethers.formatUnits(amount, token.decimals);
  return ethers.parseUnits(amount.toString(),token.decimals)
};


interface ChainInfo{
  chainId: number,
  rpcUrl: string
}

const providers: Map<Chain, ChainInfo> = new Map([

    [
      "Ethereum",
      {
        chainId: 1,
        rpcUrl: "https://intensive-quaint-cherry.quiknode.pro/3cb8d0b60a9f8979781612aa2637b19a3a62501d/"
      }
    ],


    [
      "Arbitrum",
      {
        chainId: 42161,
        rpcUrl: "https://capable-sparkling-ensemble.arbitrum-mainnet.quiknode.pro/de55544250d7c1f6aed7a74676f2f8bd49b78b8c"
      }
    ],
  ]
)



export const getTokenBalance = async (walletAddress:string,token: AssetData): Promise<number | undefined>=> {
  if(token.chain !=="Ethereum" && token.chain !=="Arbitrum")
    return

  const provider = new JsonRpcProvider(providers.get(token.chain)!.rpcUrl);

  if(token.symbol === "ETH"){
    const rawBalance = await provider.getBalance(walletAddress);  
    const balance = Number(ethers.formatEther( rawBalance!)) 
    return balance
  }

  const tokenAbi = [
    "function balanceOf(address owner) view returns (uint256)"
  ];

  const tokenContract = new ethers.Contract(token.contractAddress!, tokenAbi, provider);
  const rawBalance = await tokenContract.balanceOf(walletAddress);
  const balance = Number(ethers.formatUnits( rawBalance!, token.decimals))   
  return balance
  
}