import "./App.css";
import { AssetData } from "@chainflip/sdk/swap";
import { useState } from "react";
import { ArrowSwap20Regular } from "@fluentui/react-icons";

import useChainflipTokens from "./hooks/useChainflipTokens";
import { swapSDK } from "./swapSDK";
import { TokenBox } from "./components/tokenBox";
import { QuoteDetail } from "./components/quoteDetail";
import CheckWalletConnectionButton from "./components/wallet/CheckWalletConnectionButton";
import useConfig from "./hooks/useConfig";
import { cn } from "./utils/cn";

function App() {
  const {
    primaryBackground,
    secondaryBackground,
    primaryBorder,
    primaryBorderFocus,
    secondaryBorder,
  } = useConfig();

  const { data: tokens, isSuccess: tokensLoaded } = useChainflipTokens();

  const [sourceToken, setSourceToken] = useState<AssetData | undefined>(
    undefined
  );
  const [destToken, setDestToken] = useState<AssetData | undefined>(undefined);

  const [sourceAmount, setSourceAmount] = useState(0.0);
  const [destAmount, setDestAmount] = useState(0.0);

  const [destWalletAddress, setDestWalletAddress] = useState("");

  if (sourceToken === undefined && tokensLoaded) {
    setSourceToken(tokens!.find((token) => token.symbol === "ETH"));
  }

  if (destToken === undefined && tokensLoaded) {
    setDestToken(tokens!.find((token) => token.symbol === "BTC"));
  }

  const executeBridge = () => {
    swapSDK.executeSwap({
      amount: sourceAmount.toString(),
      srcAsset: sourceToken!.asset,
      srcChain: sourceToken!.chain,
      destAsset: destToken!.asset,
      destChain: destToken!.chain,
      destAddress: destWalletAddress,
    });
  };

  const swapTokens = () => {
    const tmpToken = sourceToken;
    const tmpAmount = sourceAmount;

    setSourceToken(destToken);
    setSourceAmount(destAmount);

    setDestToken(tmpToken);
    setDestAmount(tmpAmount);
  };

  if (
    sourceToken !== undefined &&
    destToken !== undefined &&
    tokens != undefined
  ) {
    return (
      <div
        className={cn(
          "w-full lg:w-[600px] lg:max-w-[780px] flex items-center justify-center py-4 px-6 rounded-3xl border",
          secondaryBackground,
          primaryBorder
        )}
      >
        {/* Background */}
        <div className={`fixed -z-10 inset-0 ${secondaryBackground}`}>
          <div
            className={`absolute -top-1/2 right-[50vw] h-[200vh] w-[150vh] rounded-full ${primaryBackground}`}
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <TokenBox
            label="From"
            amount={sourceAmount}
            selectedToken={sourceToken}
            onTokenChanged={(token) => setSourceToken(token)}
            onAmountChanged={(newValue) => setSourceAmount(newValue)}
            tokens={tokens}
          />

          <button
            onClick={swapTokens}
            className={cn(
              "flex items-center justify-center p-1 hover:bg-opacity-70 outline-none focus:outline-none border-none transition-all duration-300",
              primaryBackground
            )}
          >
            <ArrowSwap20Regular className="rotate-90 text-white" />
          </button>

          <TokenBox
            label="To"
            amount={destAmount}
            selectedToken={destToken}
            onTokenChanged={(token) => setDestToken(token)}
            tokens={tokens}
            onAmountChanged={(newValue) => setDestAmount(newValue)}
          />

          <div className="w-full flex items-center justify-between">
            <input
              id="target-input"
              type="text"
              className={cn(
                "w-full h-10 p-2 rounded-lg border  outline-none transition-all duration-300",
                secondaryBackground,
                secondaryBorder,
                primaryBorderFocus
              )}
              placeholder="Enter target wallet address"
              onChange={(ev) => setDestWalletAddress(ev.target.value)}
            />
          </div>

          <QuoteDetail
            sourceChain={sourceToken.chain}
            sourceToken={sourceToken}
            destChain={destToken.chain}
            destToken={destToken}
            amount={sourceAmount.toString()}
          />

          <CheckWalletConnectionButton>
            <button
              onClick={() => executeBridge()}
              className={cn(
                "w-full h-12 min-h-12 flex items-center justify-center hover:bg-opacity-80 outline-none border-none focus:outline-none transition-all duration-300",
                primaryBackground
              )}
            >
              Bridge
            </button>
          </CheckWalletConnectionButton>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
