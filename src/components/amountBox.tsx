import { ArrowSwap16Regular } from "@fluentui/react-icons";
import { useTokensInfo } from "../hooks/useTokensInfo";
import { AssetData } from "@chainflip/sdk/swap";
import { useState } from "react";
import useConfig from "../hooks/useConfig";
import { cn } from "../utils/cn";

interface IProps {
  onChange: (newAmount: number) => void;
  token: AssetData;
  amount: number;
}

const AmountBox = (props: IProps) => {
  const { tertiaryBackground, primaryBorderFocus, primaryText } = useConfig();

  const { getTokenInfo, isLoaded } = useTokensInfo();
  const { token, onChange } = props;

  const [amount, setAmount] = useState(props.amount.toString());

  const [parsedAmount, setParsedAmount] = useState(0);
  const [useUSDAmount, setUseUSDAmount] = useState(false);

  const toggleTokenUSD = () => {
    setUseUSDAmount(!useUSDAmount);

    if (useUSDAmount) {
      const calculatedAmount = parsedAmount / getTokenInfo(token)?.price;
      setAmount(calculatedAmount.toString());
      setParsedAmount(calculatedAmount);
    } else {
      const calculatedAmount = parsedAmount * getTokenInfo(token)?.price;
      setAmount(calculatedAmount.toString());
      setParsedAmount(calculatedAmount);
    }
  };

  const onAmountChanged = (amount: string) => {
    setAmount(amount.toString());

    const floatAmount = parseFloat(amount === "" ? "0" : amount);
    if (!isNaN(floatAmount)) {
      setParsedAmount(floatAmount);
      onChange(
        useUSDAmount ? floatAmount / getTokenInfo(token)?.price : floatAmount
      );
    }
  };

  if (isLoaded) {
    return (
      <div className="grid grid-cols-9 items-center gap-2">
        <input
          className={cn(
            "col-span-4 h-12 outline-none focus:outline-none border-b-2 border-transparent transition-all duration-300",
            tertiaryBackground,
            primaryBorderFocus,
            primaryText
          )}
          placeholder="0"
          onChange={(ev) => onAmountChanged(ev.target.value)}
          value={amount}
        />

        <span className={primaryText}>
          {useUSDAmount ? "$" : token.symbol}{" "}
        </span>

        <button
          onClick={toggleTokenUSD}
          className={cn(
            "col-span-1 flex items-center justify-center p-2 hover:brightness-105 outline-none border-none focus:outline-none transition-all duration-300",
            tertiaryBackground
          )}
        >
          <ArrowSwap16Regular className={cn("h-5", primaryText)} />
        </button>

        <p
          className={cn(
            "col-span-3 lg:max-w-[133px] w-full truncate ",
            primaryText
          )}
        >
          {!useUSDAmount ? "$" : ""}
          {useUSDAmount
            ? parsedAmount / getTokenInfo(token).price
            : parsedAmount * getTokenInfo(token).price}{" "}
          {useUSDAmount ? token.symbol : null}
        </p>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export { AmountBox };
