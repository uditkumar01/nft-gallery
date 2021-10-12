import { Route, Routes, Navigate } from "react-router-dom";
import Landing from "./Landing/Landing";
import Home from "./Home/Home";
import Account from "./Account/Account";
import useAuth from "../context/Auth/Auth";
import { Collections } from "./Collections/Collections";
import { Collection } from "./Collection/Collection";
import NFT from "./NFT/NFT";

export default function AllRoutes() {
  const { authState } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/n/:username" element={<NFT />} />
      <Route path="/account/:username" element={<Account />} />
      <Route
        path="/account"
        element={
          <Navigate
            to={
              authState?.user?.username
                ? `/account/${authState?.user?.username}`
                : "/"
            }
          />
        }
      />
      <Route path="/collections/:username" element={<Collections />} />
      <Route
        path="/collections"
        element={
          <Navigate
            to={
              authState?.user?.username
                ? `/collections/${authState?.user?.username}`
                : "/"
            }
          />
        }
      />
      <Route path="/collection/:collectionId" element={<Collection />} />
    </Routes>
  );
}
