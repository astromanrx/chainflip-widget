import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

import WalletContextProvider from "./providers/WalletContextProvider.tsx";
import { ConfigProvider } from "./providers/ConfigProvider.tsx";

const initialConfig = {
  primaryBackground: "bg-[#7FC133]",
  secondaryBackground: "bg-[#DBDBDB]",
  tertiaryBackground: "bg-[#e6e6e6]",
  primaryText: "text-[#000000]",
  secondaryText: "text-[#6D6D6D]",
  primaryBorder: "border-[#90d82d]",
  primaryBorderHover: "hover:border-[#90d82d]",
  primaryBorderFocus: "focus:border-[#90d82d]",
  secondaryBorder: "border-[#9ca3af]",
  circularLoaderColor: "border-t-[#7FC133]",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider initialConfig={initialConfig}>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </ConfigProvider>
);
