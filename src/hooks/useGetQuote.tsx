import { useQuery } from "@tanstack/react-query";
import type { AssetData, Chain } from "@chainflip/sdk/swap";

import { swapSDK } from "../swapSDK";
import { queries } from "../static/queries";
import { useDebounce } from "./useDebounce";
import { applyDecimal } from "../utils";

interface IProps {
  sourceChain: Chain;
  sourceToken: AssetData;
  destChain: Chain;
  destToken: AssetData;
  amount: string;
}

const useGetQuote = ({
  destToken,
  sourceChain,
  sourceToken,
  destChain,
  amount,
}: IProps) => {
  const debouncedAmount = useDebounce(amount);

  return useQuery({
    queryKey: [queries.GET_QUOTE, sourceChain, destChain, debouncedAmount],
    queryFn: () => {
      return swapSDK.getQuote({
        srcChain: sourceChain,
        srcAsset: sourceToken.asset,
        destChain: destChain,
        destAsset: destToken.asset,
        amount: applyDecimal(
          parseFloat(debouncedAmount),
          sourceToken
        ).toString(),
      });
    },
    enabled:
      !!sourceToken &&
      !!destToken &&
      !isNaN(parseFloat(debouncedAmount)) &&
      Number(debouncedAmount) > 0,
  });
};

export default useGetQuote;
