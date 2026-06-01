import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './providers/LanguageProvider'
import { WalletProvider } from './providers/WalletProvider'
import { ModalProvider } from './components/common/Modal'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <WalletProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </WalletProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
