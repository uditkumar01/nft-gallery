import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { firebase, auth, firestore } from "../../Firebase";
import { createUserEntity } from "../../Firebase/User";
import { authReducer } from "./AuthReducer";

const AuthContext = createContext({});

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth()
    .signInWithPopup(provider)
    .catch((err) => {
      console.log("signIn error", err.message, err);
      return { error: "something went wrong", success: false };
    });
  return { success: true };
};

const signOut = () => {
  if (auth().currentUser) {
    auth()
      .signOut()
      .catch((err) => {
        console.log("signOut error", err.message, err);
        return { error: "something went wrong", success: false };
      });
  }
  return { success: true };
};

export function AuthProvider({ children }) {
  const initialState = { isLoggedIn: false };
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  useEffect(() => {
    const observer = auth().onAuthStateChanged(async function (user) {
      if (user) {
        authDispatch({
          type: "LOGIN",
          payload: true,
        });
        await createUserEntity(user);
        let firestoreUser = {};
        const firestoreUserRef = await firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        if (firestoreUserRef.exists) {
          firestoreUser = firestoreUserRef.data();
        }
        authDispatch({
          type: "SET_USER",
          payload: {
            ...firestoreUser,
            uid: auth()?.currentUser?.uid,
            email: auth()?.currentUser?.email,
            displayName: auth()?.currentUser?.displayName,
            photoURL: auth()?.currentUser?.photoURL,
          },
        });
        console.log("user logged in");
      } else {
        authDispatch({
          type: "LOGIN",
          payload: false,
        });
        console.log("user logged out");
      }
      setShowLoadingScreen(false);
    });
    console.log("observer", observer);
    return () => {
      observer();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        authDispatch,
        signIn,
        signOut,
        showLoadingScreen,
        setShowLoadingScreen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
