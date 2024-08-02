import "./App.css";
import { useState } from "react";
import { ArrowSwap20Regular } from "@fluentui/react-icons";

import useChainflipTokens from "./hooks/useChainflipTokens";
import { useSwapSDK } from "./hooks/useSwapSDK";
import { TokenBox } from "./components/tokenBox";
import { QuoteDetail } from "./components/quoteDetail";
import CheckWalletConnectionButton from "./components/wallet/CheckWalletConnectionButton";
import useConfig from "./hooks/useConfig";
import { cn } from "./utils/cn";
import { useWidgetStore } from "./store";

function App() {
  const {
    primaryBackground,
    secondaryBackground,
    primaryBorder,
    primaryBorderFocus,
    secondaryBorder,
  } = useConfig();

  const { data: tokens, isSuccess: tokensLoaded } = useChainflipTokens();  

  const store = useWidgetStore();

  const [destWalletAddress, setDestWalletAddress] = useState("");

  if (store.sourceToken === undefined && tokensLoaded) {
    store.setSourceToken(tokens!.find((token) => token.symbol === "ETH")!);
  }

  if (store.destToken === undefined && tokensLoaded) {
    store.setDestToken(tokens!.find((token) => token.symbol === "BTC")!);
  }

  const swapSDK = useSwapSDK()

  const executeBridge = () => {
    swapSDK.executeSwap({
      amount: store.sourceAmount.toString(),
      srcAsset: store.sourceToken!.asset,
      srcChain: store.sourceToken!.chain,
      destAsset: store.destToken!.asset,
      destChain: store.destToken!.chain,
      destAddress: destWalletAddress,
    });
  };

  const swapTokens = () => {
    store.swapSourceWithDest();
  };

  if (
    store.sourceToken !== undefined &&
    store.destToken !== undefined &&
    tokens != undefined
  ) {
    return (
      <div
        className={cn(
          "w-full lg:w-[780px] lg:max-w-[780px] flex items-center justify-center py-4 px-6 rounded-3xl border",
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
            amount={store.sourceAmount}
            selectedToken={store.sourceToken}
            onTokenChanged={(token) => store.setSourceToken(token)}
            onAmountChanged={(newValue) => store.setSourceAmount(newValue)}
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
            amount={store.destAmount}
            selectedToken={store.destToken}
            onTokenChanged={(token) => store.setDestToken(token)}
            tokens={tokens}
            onAmountChanged={(newValue) => store.setDestAmount(newValue)}
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
            sourceChain={store.sourceToken.chain}
            sourceToken={store.sourceToken}
            destChain={store.destToken.chain}
            destToken={store.destToken}
            amount={store.sourceAmount.toString()}
          />

          <CheckWalletConnectionButton>
            <button
              onClick={() => executeBridge()}
              className={cn(
                "w-full h-12 min-h-12 flex items-center justify-center hover:bg-opacity-80 outline-none border-none focus:outline-none transition-all duration-300",
                primaryBackground
              )}
            >
              Swap
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
