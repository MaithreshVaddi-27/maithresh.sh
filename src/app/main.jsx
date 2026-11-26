import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@astryxdesign/core/reset.css'
import '@astryxdesign/core/astryx.css'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import '../styles/monograph.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
