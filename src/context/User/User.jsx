import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { firestore } from "../../Firebase";
import useAuth from "../Auth/Auth";

function userReducer(state, action) {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    default:
      return state;
  }
}

const UserContext = createContext({});

export function UserProvider({ children }) {
  const initialState = { users: [] };
  const {
    authState: { isLoggedIn },
    showLoadingScreen,
  } = useAuth();
  const [userState, userDispatch] = useReducer(userReducer, initialState);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    // fetch all users from firestore and dispatch them to reducer
    if (!showLoadingScreen && isLoggedIn) {
      (async () => {
        firestore()
          .collection("users")
          .onSnapshot((snapshot) => {
            const users = snapshot.docs.map((doc) => ({
              uid: doc.id,
              ...doc.data(),
            }));
            userDispatch({ type: "SET_USERS", payload: users });
          });
      })();
    }
    console.log("trigger", trigger);
  }, [isLoggedIn, showLoadingScreen, trigger]);

  return (
    <UserContext.Provider value={{ ...userState, userDispatch, setTrigger }}>
      {children}
    </UserContext.Provider>
  );
}

export default function useUser() {
  return useContext(UserContext);
}
