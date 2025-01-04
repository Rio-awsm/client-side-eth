import React from "react";
import "./App.css";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  WagmiProvider,
} from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
        <IsConnected />
        <TotalBalance />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

function TotalSupply() {
  const { data, isLoading, error } = useReadContract({
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "totalSupply",
  });

  return <div>Total supply - {JSON.stringify(data?.toString())}</div>;
}

function TotalBalance() {
  const { address } = useAccount();
  const { data, isLoading, error } = useReadContract({
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [address?.toString()],
  });

  if(!address) {
    return (
      <div>Cant get Balance</div>
    )
  }

  if(isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return <div>Balance - {JSON.stringify(data?.toString())}</div>;
}

function ConnectWallet() {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (address) {
    return (
      <div>
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

function IsConnected() {
  const { address } = useAccount();

  if(address) {
    return(
      <div>You are Connected with : {address}</div>
    )
  }
  return (
    <div>You are not Connected</div>
  )
}

export default App;
