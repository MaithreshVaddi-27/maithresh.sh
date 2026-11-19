import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// styles.css is linked from index.html, not imported here — see the note there.
// Mark the document as JS-capable before React paints: reveal elements are only
// hidden under `.js`, so with scripting disabled they stay visible by default.
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
