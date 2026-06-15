import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Importe o arquivo CSS que criamos
import './app/styles/index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)