import { useContext } from "react";
import { ConfigContext } from "../providers/ConfigProvider";

const useConfig = () => {
  const { config } = useContext(ConfigContext);

  return config;
};

export default useConfig;
