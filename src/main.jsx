import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource-variable/syne/wght.css'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './styles/index.css'

import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
