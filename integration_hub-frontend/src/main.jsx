import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import ContextContainer from './context/contexts-container.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ContextContainer> */}
      <App />
    {/* </ContextContainer> */}
  </StrictMode>,
)
