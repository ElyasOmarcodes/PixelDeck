import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadGoogleFonts } from '@/utils/fonts'
import { abandonBootstrap, bootstrapProjects } from '@/store/projects'
import { initUiLanguage } from '@/i18n'

declare global {
  interface Window {
    __EXPORT_CONFIG__?: unknown
  }
}

// Load Google Fonts for the editor (not needed in headless export)
if (!window.__EXPORT_CONFIG__) {
  loadGoogleFonts()
  // Stamp lang/dir on <html> before the first paint so an RTL interface never
  // flashes left-to-right. Headless export keeps the document untouched — the
  // rendered PNGs must not depend on whatever UI language was last picked.
  initUiLanguage()
}

// If the CLI injected __EXPORT_CONFIG__ before page load, run in headless export mode.
// Otherwise render the full editor UI.
const isExportMode = !!window.__EXPORT_CONFIG__

// Lazy-load ExportApp so its rendering path (Playwright headless only) is a
// separate chunk and doesn't bloat the editor bundle.
// eslint-disable-next-line react-refresh/only-export-components
const ExportApp = lazy(() =>
  import('./pages/ExportApp.tsx').then((m) => ({ default: m.ExportApp })),
)

async function mount(): Promise<void> {
  if (!isExportMode) {
    let bootstrapTimer: ReturnType<typeof setTimeout> | undefined
    try {
      await Promise.race([
        bootstrapProjects(),
        new Promise<never>((_, reject) => {
          bootstrapTimer = setTimeout(() => {
            abandonBootstrap()
            reject(new Error('bootstrap timeout'))
          }, 8000)
        }),
      ])
    } catch (err) {
      console.error('[PixelDeck] Project bootstrap failed', err)
    } finally {
      if (bootstrapTimer) clearTimeout(bootstrapTimer)
    }
  }

  createRoot(document.getElementById('root')!).render(
    isExportMode
      ? <Suspense><ExportApp /></Suspense>
      : (
        <StrictMode>
          <App />
        </StrictMode>
      )
  )
}

mount().catch((err) => console.error('[PixelDeck] fatal mount error', err))
