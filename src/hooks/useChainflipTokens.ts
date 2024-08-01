import { useQuery } from "@tanstack/react-query";
import { AssetData } from "@chainflip/sdk/swap";

import { queries } from "../static/queries";
import { swapSDK } from "../swapSDK";

const useChainflipTokens = () => {
  return useQuery({
    queryKey: [queries.GET_TOKENS],
    queryFn: async () => {
      const allTokens: Array<AssetData> = [];
      const chains = await swapSDK.getChains();
      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        if (chain !== undefined) {
          const tokens = await swapSDK.getAssets(chain.chain);
          allTokens.push(...tokens);
        }
      }
      return allTokens;
    },
  });
};

export default useChainflipTokens;
