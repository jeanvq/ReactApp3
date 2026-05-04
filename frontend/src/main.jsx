// src/main.jsx
// This is the entry point of the React app.
// It mounts the <App /> component into the #root div in index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)