import { createContext, useContext, useEffect, useReducer } from "react";
import { firestore } from "../../Firebase";
import useAuth from "../Auth/Auth";

function postReducer(state, action) {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
      };
    case "ADD_POST":
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    default:
      return state;
  }
}

const PostContext = createContext({});

export function PostProvider({ children }) {
  const initialState = { posts: [] };
  const {
    authState: { isLoggedIn },
    showLoadingScreen,
  } = useAuth();
  const [postState, postDispatch] = useReducer(postReducer, initialState);

  useEffect(() => {
    // fetch all posts from firestore and dispatch them to reducer
    try {
      if (!showLoadingScreen && isLoggedIn) {
        (async () => {
          await firestore()
            .collection("posts")
            .orderBy("createdAt", "desc")
            .onSnapshot(async (snapshot) => {
              const resData = await Promise.all(
                snapshot.docs.map(async (doc) => {
                  const data = doc.data();
                  const user = (await data?.user?.get()).data();
                  return {
                    ...data,
                    uid: doc?.id,
                    user: {
                      uid: user?.uid,
                      displayName: user?.displayName,
                      photoURL: user?.photoURL,
                      email: user?.email,
                      followers: user?.followers,
                      following: user?.following,
                    },
                  };
                })
              );
              postDispatch({
                type: "SET_POSTS",
                payload: resData,
              });
            });
        })();
      }
    } catch (error) {
      console.log(error);
    }
  }, [isLoggedIn, showLoadingScreen]);

  return (
    <PostContext.Provider value={{ ...postState, postDispatch }}>
      {children}
    </PostContext.Provider>
  );
}

export default function usePost() {
  return useContext(PostContext);
}
