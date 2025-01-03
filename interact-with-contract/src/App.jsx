import React from "react";
import "./App.css";
import { useAccount, useConnect, useDisconnect, WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

function ConnectWallet() {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (address) {
    return (
      <div>
        You are connected to {address}
        <div>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      </div>
    );
  }

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      Connect Via {connector.name}
    </button>
  ));
}

export default App;
