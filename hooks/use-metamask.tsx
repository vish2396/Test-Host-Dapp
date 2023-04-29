import React from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { MetaMaskInpageProvider } from "@metamask/providers";
import detectEthereumProvider from "@metamask/detect-provider";

export const useMetamask = () => {
  const [account, setAccount] = React.useState<string>("");
  const [ethereum, setEthereum] = React.useState<MetaMaskInpageProvider | null>(
    null
  );

  const onboarding = React.useRef<MetaMaskOnboarding>();

  function handleOnboarding() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum?.request({ method: "eth_requestAccounts" }).then((accounts) => {
        console.log(accounts);
      });
    } else {
      onboarding.current?.startOnboarding();
    }
  }

  function handleAccountChange(...args: unknown[]) {
    const accounts = args[0] as string[] | undefined;
  
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    } else if (ethereum?.selectedAddress) {
      setAccount(ethereum.selectedAddress);
    } else {
      setAccount("");
    }
  }

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }

    detectEthereumProvider().then((provider) => {
      if (!provider) {
        return;
      }

      setEthereum(provider as MetaMaskInpageProvider);
    });
  }, []);

  React.useEffect(() => {
    if (ethereum) {
      handleAccountChange(ethereum.selectedAddress ? [ethereum.selectedAddress] : []);

      ethereum.on("accountsChanged", handleAccountChange);
    }
  },);

  return { ethereum, account, handleOnboarding };
};