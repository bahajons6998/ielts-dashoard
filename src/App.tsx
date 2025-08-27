import { BrowserRouter } from "react-router-dom";
import Router from "./utils/Router";
import Navbar from "./pages/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Router />
    </BrowserRouter>
  );
}

export default App;