import { createContext, useContext, useEffect, useReducer } from "react";
import { getNftsFromAccountAddress } from "../../api/getNFTS";
import { firestore } from "../../Firebase";
import useAuth from "../Auth/Auth";

export function nftsReducer(state, action) {
  switch (action.type) {
    case "SET_NFTS":
      return {
        ...state,
        nfts: {
          ...state.nfts,
          [action.payload.chain]: action.payload.nfts,
        },
      };
    case "ADD_NFT":
      return {
        ...state,
        nfts: [...state.nfts, action.payload],
      };
    default:
      return state;
  }
}

const account = "0x4c8f93d95354ecf0b54222be4c4e8fb37ba8f3bc";

const NftsContext = createContext({});

export function NftsProvider({ children }) {
  const initialState = {
    nfts: {
      ethereum: [],
      polygon: [],
      tezos: [],
    },
  };
  const { authState, showLoadingScreen } = useAuth();
  const [nftsState, nftsDispatch] = useReducer(nftsReducer, initialState);

  useEffect(() => {
    // fetch all posts from firestore and dispatch them to reducer
    try {
      if (
        !showLoadingScreen &&
        authState?.isLoggedIn &&
        authState?.user?.ethAddresses
      ) {
        (async () => {
          // filter out all nfts using userId
          const totalNfts = [];
          for (const ethAddress of authState.user.ethAddresses) {
            const { nfts } = await getNftsFromAccountAddress(ethAddress);
            totalNfts.push(...nfts);
          }

          nftsDispatch({
            type: "SET_NFTS",
            payload: {
              chain: "ethereum",
              nfts: totalNfts,
            },
          });
        })();
      }
    } catch (error) {
      console.log(error);
    }
  }, [authState?.isLoggedIn, authState?.user?.ethAddresses, showLoadingScreen]);
  console.log("colState", nftsState);
  return (
    <NftsContext.Provider value={{ ...nftsState, nftsDispatch }}>
      {children}
    </NftsContext.Provider>
  );
}

export default function useNFTs() {
  return useContext(NftsContext);
}
