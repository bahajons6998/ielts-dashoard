import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. PrimeReact asosiy style
import 'primereact/resources/primereact.min.css';

// 3. PrimeReact tema (birini tanlaysiz)
import 'primereact/resources/themes/lara-light-blue/theme.css';

// 4. PrimeIcons (ikonka to‘plami)
import 'primeicons/primeicons.css';

// 5. O‘z CSS’ingiz (agar bo‘lsa)
import './index.css';
createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
