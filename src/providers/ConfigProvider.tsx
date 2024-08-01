import { createContext, ReactNode, useState } from "react";
import { defaultConfig } from "../static/config";

interface IConfig {
  primaryBackground: string;
  secondaryBackground: string;
  tertiaryBackground: string;
  primaryText: string;
  secondaryText: string;
  primaryBorder: string;
  primaryBorderHover: string;
  primaryBorderFocus: string;
  circularLoaderColor: string;
  secondaryBorder: string;
}

interface ConfigContextType {
  config: IConfig;
  setConfig: React.Dispatch<React.SetStateAction<IConfig>>;
}

export const ConfigContext = createContext<ConfigContextType>(
  {} as ConfigContextType
);

interface IProps {
  children: ReactNode;
  initialConfig?: IConfig;
}

export const ConfigProvider = ({
  children,
  initialConfig = defaultConfig,
}: IProps) => {
  const [config, setConfig] = useState(initialConfig);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
