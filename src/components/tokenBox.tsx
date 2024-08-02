import { AssetData } from "@chainflip/sdk/swap";
import { Wallet24Regular } from "@fluentui/react-icons";

import { AmountBox } from "./amountBox";
import { TokenDropDown } from "./tokenDropDown";
import { cn } from "../utils/cn";
import useConfig from "../hooks/useConfig";
import useGetUserBalance from "../hooks/useGetUserBalance";
import CircularLoader from "./wallet/ui/CircularLoader";
import { useWidgetStore } from "../store";

interface IProps {
  label: "From" | "To";
  tokens: Array<AssetData>;
  selectedToken: AssetData;
  amount: number;
  onTokenChanged: (selectedToken: AssetData) => void;
  onAmountChanged: (newAmount: number) => void;
  balance?: number;
}

const TokenBox = ({
  label,
  tokens,
  selectedToken,
  amount,
  onTokenChanged,
  onAmountChanged,
}: IProps) => {
  const {
    secondaryBackground,
    secondaryBorder,
    tertiaryBackground,
    primaryText,
  } = useConfig();

  const {
    data: userTokenBalance,
    isLoading: isLoadingUserTokenBalance,
    isSuccess: isSuccessUserTokenBalance,
  } = useGetUserBalance({ token: selectedToken });

  const store = useWidgetStore();

  const setAmountPercent = (percentage:number)=>{
    if(userTokenBalance !== undefined){
      console.log(`Setting source amount to ${userTokenBalance * percentage} `)
      store.setSourceAmount(userTokenBalance * percentage);
    }else{
      console.log(userTokenBalance)
    }
  }  

  

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-between gap-2 pt-3 rounded-2xl border",
        secondaryBackground,
        secondaryBorder
      )}
    >
      <div className="w-full flex items-center justify-between px-4">
        <h3 className={cn("text-xl font-normal", primaryText)}>{label}</h3>

        {label === "From" ? (
          <>
            {isLoadingUserTokenBalance ? (
              <CircularLoader className="size-4 border-2" />
            ) : isSuccessUserTokenBalance ? (
              <div className="w-full flex items-center justify-end gap-2">
                <Wallet24Regular className={primaryText} />

                <p className={cn("", primaryText)}>{userTokenBalance?.toFixed(5) || "-"}</p>

                <button onClick={()=>setAmountPercent(1.0)} className="h-6 w-10 flex items-center justify-center rounded-lg border border-white bg-black hover:bg-opacity-80 text-xs text-white hover:border-transparent outline-none focus:outline-none">
                  Max
                </button>

                <button onClick={()=>setAmountPercent(0.75)} className="h-6 w-10 flex items-center justify-center rounded-lg border border-white bg-black hover:bg-opacity-80 text-xs text-white hover:border-transparent outline-none focus:outline-none">
                  75%
                </button>

                <button onClick={()=>setAmountPercent(0.5)} className="h-6 w-10 flex items-center justify-center rounded-lg border border-white bg-black hover:bg-opacity-80 text-xs text-white hover:border-transparent outline-none focus:outline-none">
                  50%
                </button>

                <button onClick={()=>setAmountPercent(0.25)} className="h-6 w-10 flex items-center justify-center rounded-lg border border-white bg-black hover:bg-opacity-80 text-xs text-white hover:border-transparent outline-none focus:outline-none">
                  25%
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div
        className={cn(
          "w-full flex items-center justify-between gap-2 p-2 rounded-2xl border",
          tertiaryBackground,
          secondaryBorder
        )}
      >
        <TokenDropDown
          tokens={tokens!}
          onChange={onTokenChanged}
          selectedToken={selectedToken}
        />

        <AmountBox
          token={selectedToken}
          amount={amount}     
          onChange={onAmountChanged}     
        />
      </div>
    </div>
  );
};

export { TokenBox };
