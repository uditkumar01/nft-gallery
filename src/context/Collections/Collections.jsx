import { createContext, useContext, useEffect, useReducer } from "react";
import { firestore } from "../../Firebase";
import useAuth from "../Auth/Auth";

function collectionsReducer(state, action) {
  switch (action.type) {
    case "SET_COLLECTIONS":
      return {
        ...state,
        collections: action.payload,
      };
    case "ADD_COLLECTION":
      return {
        ...state,
        collections: [...state.collections, action.payload],
      };
    case "UPDATE_COLLECTION":
      return {
        ...state,
        collections: state.collections.map((collection) => {
          if (collection._id === action.payload.collectionId) {
            return {
              ...collection,
              items: [...collection.items, action.payload.item],
            };
          }
          return collection;
        }),
      };
    default:
      return state;
  }
}

const CollectionsContext = createContext({});

export function CollectionsProvider({ children }) {
  const initialState = { collections: [] };
  const {
    authState: { isLoggedIn, user },
    showLoadingScreen,
  } = useAuth();
  const [collectionsState, collectionsDispatch] = useReducer(
    collectionsReducer,
    initialState
  );

  useEffect(() => {
    // fetch all posts from firestore and dispatch them to reducer
    try {
      if (!showLoadingScreen && isLoggedIn && user) {
        (async () => {
          // filter out all collections using userId
          const collections = await firestore()
            .collection("collections")
            .where("owner", "==", user?.uid)
            .get();

          collectionsDispatch({
            type: "SET_COLLECTIONS",
            payload: collections.docs.map((collection) => {
              return {
                _id: collection.id,
                ...collection.data(),
              };
            }),
          });
        })();
      }
    } catch (error) {
      console.log(error);
    }
  }, [isLoggedIn, showLoadingScreen, user]);
  console.log("colState", collectionsState);
  return (
    <CollectionsContext.Provider
      value={{ ...collectionsState, collectionsDispatch }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export default function useCollections() {
  return useContext(CollectionsContext);
}
