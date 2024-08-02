import { ArrowSwap16Regular } from "@fluentui/react-icons";
import { useTokensInfo } from "../hooks/useTokensInfo";
import { AssetData } from "@chainflip/sdk/swap";
import { useEffect, useState } from "react";
import useConfig from "../hooks/useConfig";
import { cn } from "../utils/cn";
import CircularLoader from "./wallet/ui/CircularLoader";

interface IAmountBoxProps {  
  token: AssetData;  
  amount: number;
  onChange: (amount:number)=>void;
}


const AmountBox = (props: IAmountBoxProps) => {

  const { tertiaryBackground, primaryBorderFocus, primaryText } = useConfig();
  const { getTokenInfo, isLoaded } = useTokensInfo();
  
  const { token,onChange } = props;

  const [useUSDAmount, setUseUSDAmount] = useState(false);
  const [amount,setAmount] = useState("")  
  const [transformedAmount,setTransformedAmount] = useState("")

  // useEffect(()=>{    
  //   setAmount(props.amount.toString())
  // },[props.amount])

  const convertToUSD = (amount: number, token: AssetData) => {    
    const result =  (amount * getTokenInfo(token)?.price).toFixed(2)
    console.log(`Convert ${amount}${token.symbol} to usd equals to ${result}`)
    return result
  }

  const fromUSD = (amount: number,token: AssetData)=> {    
    const result =  (amount / getTokenInfo(token)?.price).toFixed(5)
    console.log(`Convert ${amount}$ to ${token.symbol} equals to ${result}`)
    return result
  }
  

  const toggleTokenUSD = () => {
    setUseUSDAmount(!useUSDAmount);   
    setTransformedAmount(amount)
    setAmount(transformedAmount)       
  };
  

  const onAmountChanged = (amount: string) => {
    setAmount(amount.toString());

    const realAmount = parseFloat(amount === "" ? "0" : amount);
    if (!isNaN(realAmount)) {     
      onChange(
        parseFloat(useUSDAmount?transformedAmount: amount)
      );
      
      setTransformedAmount( useUSDAmount? fromUSD(realAmount,token): convertToUSD(realAmount,token) );
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
          {transformedAmount}
          {useUSDAmount ? token.symbol : null}
        </p>
      </div>
    );
  } else {
    return <CircularLoader />;
  }
};

export { AmountBox };
