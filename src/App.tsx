import { BrowserRouter } from "react-router-dom";
import Router from "./utils/Router";
import Navbar from "./pages/Navbar";

function App() {
  const element = document.createElement('h1')
  element.innerHTML = 'Hello World'
  document.body.appendChild(element)
  return (
    <BrowserRouter>
      <Navbar />
      <Router />
    </BrowserRouter>
  );
}

export default App;