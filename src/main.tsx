import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
