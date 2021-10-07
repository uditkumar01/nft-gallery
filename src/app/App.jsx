import "./App.css";
import AllRoutes from "../pages";
import { LoadingScreen } from "../components";
import useAuth from "../context/Auth/Auth";

export default function App() {
  const { showLoadingScreen } = useAuth();
  return <>{showLoadingScreen ? <LoadingScreen /> : <AllRoutes />}</>;
}
