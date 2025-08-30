import { HashRouter } from "react-router-dom";
import Router from "./utils/Router";
import Navbar from "./pages/Navbar";

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Router />
    </HashRouter>
  );
}

export default App;