import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CatalogAdmin from './CatalogAdmin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CatalogAdmin />
  </StrictMode>,
)