import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GlobalStateProvider } from './context/GlobalState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStateProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalStateProvider>
  </StrictMode>,
)
