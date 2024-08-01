import axios from "axios";
import { AssetData } from "@chainflip/sdk/swap";
import { useQuery } from "@tanstack/react-query";

import { TokenInfo } from "../types/tokenInfo";
import { queries } from "../static/queries";

const useTokensInfo = () => {
  const {
    data: tokensInfo,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: [queries.GET_TOKENS_INFO],
    queryFn: async () => {
      const url = `https://li.quest/v1/tokens`;
      const res = await axios(url);
      const chainTokens = res.data.tokens
      const allTokens = new Array<TokenInfo>()
      for(const prop in chainTokens){
        allTokens.push(...chainTokens[prop] as Array<TokenInfo>)
      }
      console.log(res)
      console.log(allTokens)
      return allTokens ;      
    },
    staleTime: 60 * 1000, //after 1 minute
  });

  const getTokenInfo = (asset: AssetData) => {
    if (!isSuccess) {
      throw new Error(`Tokens information not loaded yet!`);      
    }

    console.log(tokensInfo)

    const tokenInfo = tokensInfo!.find(
      (token) => token?.symbol?.toUpperCase() === asset?.symbol
    );
    if (!tokenInfo) {
      console.log(`Token not found!`);
    }
    return {
      price: tokenInfo?.priceUSD || 0,
      icon: tokenInfo?.logoURI || "",
    };
  };

  const getChainIcon = (asset: AssetData) =>{
    if (!isSuccess) {
      throw new Error(`Chains information not loaded yet!`);      
    }
    const tokenInfo = tokensInfo!.find(
      (token) => asset.chain === "Polkadot"? token?.name === "Polkadot Token" : token?.name === asset?.chain
    );

    return tokenInfo?.logoURI || "";
  }

  return {
    tokensInfo,
    isLoaded: isSuccess,
    isLoading: isLoading,
    getTokenInfo,
    getChainIcon
  };
};

export { useTokensInfo };
