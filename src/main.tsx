import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ENABLE_MSW } from './config/api.config'

async function enableMocking() {
  // Only enable MSW if explicitly set to true in environment variables
  if (!ENABLE_MSW) {
    console.log('MSW disabled - using real backend API');
    return;
  }

  console.log('MSW enabled - using mock API');
  const { worker } = await import('./api/mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
