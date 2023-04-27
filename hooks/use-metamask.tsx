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

  function handleAccountChange(accounts?: string[]) {
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
      return;
    }
    if (accounts && accounts.length === 0) {
      setAccount("");
      return;
    }
    if (ethereum?.selectedAddress) {
      setAccount(ethereum?.selectedAddress);
      return;
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
      handleAccountChange();

      ethereum?.on("accountsChanged", handleAccountChange);
    }
  }, [ethereum]);

  return { ethereum, account, handleOnboarding };
};