import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ToolProvider from './store/ToolProvider.jsx'
import BoardProvider from "./store/BoardProvider";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToolProvider>
      <BoardProvider>
        <App />
      </BoardProvider>
    </ToolProvider>
  </StrictMode>,
)
