import { Asset, AssetData, Chain } from "@chainflip/sdk/swap";

import { ethers } from "ethers";
import { useEffect, useState } from "react";

import ArrowIcon from "../assets/svgs/arrow.svg";

import useGetQuote from "../hooks/useGetQuote";
import useChainflipTokens from "../hooks/useChainflipTokens";
import useConfig from "../hooks/useConfig";
import { ArrowSwap16Regular } from "@fluentui/react-icons";
import { cn } from "../utils/cn";
import CircularLoader from "./wallet/ui/CircularLoader";
import { useWidgetStore } from "../store";

interface IProps {
  sourceToken: AssetData;
  sourceChain: Chain;
  amount: string;
  destToken: AssetData;
  destChain: Chain;
}

const QuoteDetail = ({
  sourceChain,
  sourceToken,
  amount,
  destToken,
  destChain,
}: IProps) => {
  const { secondaryBorder, primaryText, secondaryText } = useConfig();

  const { data: tokens } = useChainflipTokens();

  const [open, setOpen] = useState(false);

  const store = useWidgetStore();

  const getTokenDecimal = (asset: Asset) => {
    return Math.pow(
      10,
      tokens!.find((token) => token.symbol === asset)!.decimals
    );
  };

  const { data, isSuccess, isLoading, status } = useGetQuote({
    sourceToken,
    sourceChain,
    destChain,
    destToken,
    amount,
  });

  useEffect(()=>{
    if(isSuccess){
      store.setDestAmount(parseFloat(ethers.formatUnits(data.quote.egressAmount,destToken.decimals)))
    }
  },[isSuccess,amount])

  return (
    <>
      {status === "pending" && !isLoading ? (
        <div className={`h-14 flex items-center justify-center ${primaryText}`}>
          Select From/To tokens and set an amount to start finding the best
          route
        </div>
      ) : isLoading ? (
        <div className="h-14 w-full flex flex-col items-center justify-center gap-2">
          <CircularLoader className="border-2" />
        </div>
      ) : isSuccess ? (
        <div
          className={`w-full flex flex-col items-center justify-start gap-1 rounded-2xl transition-all duration-300 border ${secondaryBorder}`}
        >
          <div
            onClick={() => setOpen((prev) => !prev)}
            tabIndex={0}
            className="w-full flex items-center justify-between gap-2 p-4 cursor-pointer"
          >
            <div className="w-full flex items-center justify-end gap-2">
              <p className="ml-2 text-black">
                {ethers.formatUnits(data.amount, sourceToken.decimals)}{" "}
                {sourceToken?.symbol}
              </p>

              <ArrowSwap16Regular className={cn("h-5", primaryText)} />
              <p className="ml-2 text-black">{ethers.formatUnits(data?.quote.egressAmount, destToken.decimals)}{" "}
              {destToken?.symbol}</p>
            </div>

            <button className="size-6 min-w-6 flex items-center justify-center bg-transparent border-none outline-none focus:outline-none hover:border-none">
              <img
                src={ArrowIcon}
                className={`size-5 min-w-5 transition-all duration-300 ${
                  open ? "" : "-rotate-180"
                }`}
              />
            </button>
          </div>

          <div
            className={`grid w-full overflow-hidden transition-all duration-300 ${
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div
              className={`min-h-0 w-full flex flex-col items-center justify-start gap-2 transition-all duration-200 ${
                open ? `p-4` : ""
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <p className={secondaryText}>Amount:</p>
                <p className={primaryText}>
                  {ethers.formatUnits(data?.amount, sourceToken.decimals)}
                  <span className="ml-2">{sourceToken.symbol}</span>
                </p>
              </div>

              <div className="w-full flex items-center justify-between">
                <p className={secondaryText}>Duration:</p>
                <p className={primaryText}>
                  {data?.quote.estimatedDurationSeconds > 60
                    ? Math.round(data?.quote.estimatedDurationSeconds / 60)
                    : data?.quote.estimatedDurationSeconds}{" "}
                  {data?.quote.estimatedDurationSeconds > 60
                    ? "minutes"
                    : "seconds"}
                </p>
              </div>

              <div className="w-full flex flex-col items-center justify-centetr">
                <p className={cn("w-full text-start", secondaryText)}>
                  Fee(s):
                </p>

                {data?.quote?.includedFees?.map((fee, feeIdx) => (
                  <div
                    key={feeIdx}
                    className="w-full flex items-center justify-between text-xs"
                  >
                    <p className={secondaryText}>
                      {" "}
                      <span className="capitalize">
                        {fee?.type?.toLocaleLowerCase()}
                      </span>{" "}
                      fee on {fee?.chain}:
                    </p>
                    <p className={primaryText}>
                      {(parseFloat(fee?.amount) / getTokenDecimal(fee?.asset)).toFixed(5)}{" "}
                      {fee?.asset}
                    </p>
                  </div>
                ))}
              </div>

              {data?.quote.lowLiquidityWarning && (
                <div className="text-red-400 font-bold">
                  Warning: Liquidity low{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-14 w-full flex flex-col items-center justify-center gap-2">
          We could not find a route
        </div>
      )}
    </>
  );
};

export { QuoteDetail };
