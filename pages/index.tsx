import type { NextPage } from "next";
import Head from "next/head";
import { useMetamask } from "../hooks/use-metamask";

const Home: NextPage = () => {
  const { account, handleOnboarding } = useMetamask();

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {account.length === 0 ? (
        <button onClick={handleOnboarding}>Connect</button>
      ) : (
        account
      )}
    </div>
  );
};

export default Home;