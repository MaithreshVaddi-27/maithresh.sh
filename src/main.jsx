import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// styles.css is linked from index.html, not imported here — see the note there.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
