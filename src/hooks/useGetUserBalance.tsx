import { useQuery } from "@tanstack/react-query";
import { queries } from "../static/queries";
import { getTokenBalance } from "../utils";
import type { AssetData } from "@chainflip/sdk/swap";
import { useAccount } from "wagmi";

interface IProps {
  token: AssetData;
}

const useGetUserBalance = ({ token }: IProps) => {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: [queries.GET_USER_TOKEN_BALANCE, address, token.asset],
    queryFn: () => getTokenBalance(address as string, token),
    enabled: isConnected && !!address && !!token,
    staleTime: 1000 * 60 * 1, // 1 Minute
  });
};

export default useGetUserBalance;
