import { AssetData } from "@chainflip/sdk/swap";
import { useEffect, useRef, useState } from "react";
import { useTokensInfo } from "../hooks/useTokensInfo";
import { cn } from "../utils/cn";
import useConfig from "../hooks/useConfig";
import CircularLoader from "./wallet/ui/CircularLoader";

interface IProps {
  tokens: Array<AssetData>;
  selectedToken: AssetData;
  onChange: (selected: AssetData) => void;
}

const TokenDropDown = ({ tokens, onChange, selectedToken }: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    tertiaryBackground,
    primaryBorder,
    primaryText,
    secondaryBorder,
    primaryBorderHover,
    primaryBorderFocus,
  } = useConfig();

  const [isOpen, setIsOpen] = useState(false);

  const [tokenNameFilter, setTokenNameFilter] = useState<string | undefined>(
    selectedToken.symbol
  );

  const onSelect = (asset: AssetData) => {
    setTokenNameFilter(asset.symbol);
    onChange(asset);
  };

  const { getTokenInfo,isLoaded,getChainIcon} = useTokensInfo();
  const getTokenIcon = (asset: AssetData)=>getTokenInfo(asset).icon
  
  
  

  useEffect(() => {
    setTokenNameFilter(selectedToken.symbol);
  }, [selectedToken]);

  if(! isLoaded)
    return <CircularLoader />

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        className={cn(
          `relative w-full h-10 flex items-center justify-between rounded-md py-1.5 pl-3 pr-10 text-left border-1 focus:outline-none focus:border-1 sm:text-sm sm:leading-6 transition-all duration-300 ${
            isOpen ? primaryBorder : "border-transparent"
          }`,
          primaryBorderFocus,
          tertiaryBackground,
          primaryBorderHover,
          primaryText
        )}
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
          }

          if (!isOpen && inputRef?.current) {
            inputRef?.current?.focus();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
      >
        <div className="relative">
          <img
            src={getTokenIcon(selectedToken)}
            alt=""
            className="h-10 w-10 flex-shrink-0 rounded-full"
          />
          <img
            src={getChainIcon(selectedToken)}
            alt=""
            className="absolute bottom-0 right-0 h-5 w-5 flex-shrink-0 rounded-full"
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          className={cn(
            "ml-3 block truncate uppercase border-none outline-none",
            tertiaryBackground
          )}
          value={tokenNameFilter}
          onChange={(e) => setTokenNameFilter(e.target.value)}
          onBlur={() =>
            setTimeout(() => {
              setIsOpen(false);
            }, 200)
          }
        />
      </button>

      {isOpen && (
        <ul
          className={cn(
            "absolute top-10 flex flex-col flex-nowrap z-10 max-h-56 w-full overflow-auto rounded-md py-1 text-base shadow-lg border-1 border-opacity-5 focus:outline-none sm:text-sm",
            tertiaryBackground,
            secondaryBorder
          )}
          tabIndex={-1}
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          {tokens!
            .filter((asset) =>
              asset.symbol.startsWith(tokenNameFilter!.toUpperCase())
            )
            .map((asset) => {
              return (
                <li
                  key={asset.name}
                  tabIndex={0}
                  onClick={() => onSelect(asset)}
                  className={cn(
                    "relative flex items-center select-none py-2 pl-3 hover:backdrop-brightness-90 cursor-pointer transition-all duration-300",
                    primaryText
                  )}
                  id="listbox-option-0"
                  role="option"
                >
                  <div className="relative">
                    <img
                      src={getTokenIcon(asset)}
                      alt=""
                      className="h-10 w-10 flex-shrink-0 rounded-full"
                    />
                    <img
                      src={getChainIcon(asset)}
                      alt=""
                      className="absolute bottom-0 right-0 h-5 w-5 flex-shrink-0 rounded-full"
                    />
                  </div>
                  <p className="ml-3 block truncate font-normal">
                    <span className="font-semibold">{asset.symbol}</span> on{" "}
                    {asset.chain}
                  </p>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export { TokenDropDown };
