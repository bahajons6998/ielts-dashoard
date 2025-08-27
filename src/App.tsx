import { BrowserRouter, HashRouter } from "react-router-dom";
import Router from "./utils/Router";
import Navbar from "./pages/Navbar";

function App() {
  const element = document.createElement('h1')
  element.innerHTML = 'Hello World'
  document.body.appendChild(element)
  return (
    <HashRouter>
      <Navbar />
      <Router />
    </HashRouter>
  );
}

export default App;