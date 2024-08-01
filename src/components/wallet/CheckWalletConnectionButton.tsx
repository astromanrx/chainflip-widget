import { useAccount } from "wagmi";
import { ReactNode } from "react";

import { ConnectWalletButton } from "./ConnectWalletButton";

interface IProps {
  children: ReactNode;
}

const CheckWalletConnectionButton = ({ children }: IProps) => {
  const { isConnected } = useAccount();

  return <>{isConnected ? children : <ConnectWalletButton />}</>;
};

export default CheckWalletConnectionButton;
