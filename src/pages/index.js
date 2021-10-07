import { Route, Routes } from "react-router-dom";
import Landing from "./Landing/Landing";
import Home from "./Home/Home";
import Account from "./Account/Account";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}
