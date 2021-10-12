import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { NETWORKS } from "../../constants";
import useAuth from "../Auth/Auth";
import { updateEthereumAddresses } from "../../utils/firestore/updateEthereumAddresses";
import { updateTezosAddresses } from "../../utils/firestore/updateTezosAddresses";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import { Bitski } from "bitski";
import Web3 from "web3";
import { DAppClient } from "@airgap/beacon-sdk";

const Web3Context = createContext({});
const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const dAppClient = new DAppClient({ name: "Beacon Docs" });

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  theme: {
    background: "rgba(16, 26, 32, 0.6)",
    main: "rgb(199, 199, 199)",
    secondary: "rgb(156, 156, 156)",
    border: "rgba(0, 0, 0, 0.4)",
    hover: "rgb(16, 26, 32)",
  },
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
    torus: {
      package: Torus,
    },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: process.env.REACT_APP_FORTMATIC_KEY,
      },
    },
    authereum: {
      package: Authereum,
    },
    bitski: {
      package: Bitski,
      options: {
        clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
        callbackUrl: window.location.href + "bitski-callback.html",
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

const initWeb3 = (provider) => {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
};

export function Web3UtilityProvider({ children }) {
  const [ETHAddress, setETHAddress] = useState(null);
  const [tezosAddress, setTezosAddress] = useState(null);
  const { authState, authDispatch } = useAuth();

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();

    if (!provider?.on) {
      return;
    }

    const web3 = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    setETHAddress(accounts[0]);

    provider.on("close", () => {
      logoutOfWeb3Modal();
    });

    provider.on("accountsChanged", async (accounts) => {
      console.log("accountsChanged", accounts);
      if (!accounts || !accounts.length) {
        return;
      }
      setETHAddress(accounts[0]);
    });
  }, []);

  const loadTezos = useCallback(async () => {
    const activeAccount = await dAppClient.getActiveAccount();
    let myAddress;
    if (!activeAccount) {
      const permissions = await dAppClient.requestPermissions();
      console.log("New connection:", permissions?.address);
      myAddress = permissions?.address;
    } else {
      myAddress = activeAccount?.address;
    }
    setTezosAddress(myAddress);
  }, []);

  useEffect(() => {
    if (ETHAddress) {
      authDispatch({
        type: "SET_ETH_ADDRESS",
        payload: ETHAddress,
      });
    }
  }, [ETHAddress, authDispatch]);

  useEffect(() => {
    if (tezosAddress) {
      authDispatch({
        type: "SET_TEZOS_ADDRESS",
        payload: tezosAddress,
      });
    }
  }, [tezosAddress, authDispatch]);

  useEffect(() => {
    (async () => {
      if (ETHAddress && authState?.user?.uid) {
        await updateEthereumAddresses(authState?.user?.uid, ETHAddress);
      }
    })();
  }, [ETHAddress, authState?.user?.uid]);

  useEffect(() => {
    (async () => {
      if (tezosAddress && authState?.user?.uid) {
        await updateTezosAddresses(authState?.user?.uid, tezosAddress);
      }
    })();
  }, [tezosAddress, authState?.user?.uid]);

  return (
    <Web3Context.Provider
      value={{
        loadWeb3Modal,
        logoutOfWeb3Modal,
        loadTezos,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export default function useWeb3() {
  return useContext(Web3Context);
}

window.ethereum &&
  window.ethereum.on("chainChanged", (chainId) => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

// window.ethereum &&
//   window.ethereum.on("accountsChanged", (accounts) => {
//     web3Modal.cachedProvider &&
//       setTimeout(() => {
//         window.location.reload();
//       }, 1);
//   });
