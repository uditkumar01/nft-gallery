import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/Auth/Auth";
import { PostProvider } from "./context/Post/Post";
import { UserProvider } from "./context/User/User";
import { CollectionsProvider } from "./context/Collections/Collections";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ChakraProvider>
        <AuthProvider>
          <CollectionsProvider>
            <UserProvider>
              <PostProvider>
                <App />
              </PostProvider>
            </UserProvider>
          </CollectionsProvider>
        </AuthProvider>
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
