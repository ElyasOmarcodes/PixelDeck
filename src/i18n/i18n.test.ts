import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { en } from './locales/en'
import { ps } from './locales/ps'
import { fa } from './locales/fa'
import { UI_LANGUAGES, getLanguageMeta, translate } from './index'

const locales = { ps, fa }

describe('UI dictionaries', () => {
  it('translates every English key in every locale', () => {
    const expected = Object.keys(en).sort()
    for (const [code, dict] of Object.entries(locales)) {
      expect(Object.keys(dict).sort(), `${code} key set`).toEqual(expected)
    }
  })

  it('has no empty strings', () => {
    for (const [code, dict] of Object.entries(locales)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${code}.${key}`).not.toBe('')
      }
    }
  })

  it('keeps the same interpolation placeholders as English', () => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort()
    for (const [code, dict] of Object.entries(locales)) {
      for (const key of Object.keys(en) as (keyof typeof en)[]) {
        expect(placeholders(dict[key]), `${code}.${key}`).toEqual(placeholders(en[key]))
      }
    }
  })

  it('writes Pashto and Persian in Arabic script rather than transliterating', () => {
    const arabicScript = /[؀-ۿ]/
    // The only values that are legitimately Latin: the raw axis letters.
    const exempt = new Set(['props.x', 'props.y'])
    for (const [code, dict] of Object.entries(locales)) {
      for (const [key, value] of Object.entries(dict)) {
        if (exempt.has(key)) continue
        expect(arabicScript.test(value), `${code}.${key} = ${value}`).toBe(true)
      }
    }
  })

  it('declares a direction for every shipped language', () => {
    expect(UI_LANGUAGES.map((l) => l.code)).toEqual(['en', 'ps', 'fa'])
    expect(getLanguageMeta('en').dir).toBe('ltr')
    expect(getLanguageMeta('ps').dir).toBe('rtl')
    expect(getLanguageMeta('fa').dir).toBe('rtl')
  })
})

describe('translate', () => {
  it('returns the locale string for a known key', () => {
    expect(translate('ps', 'toolbar.settings')).toBe(ps['toolbar.settings'])
    expect(translate('fa', 'toolbar.settings')).toBe(fa['toolbar.settings'])
  })

  it('interpolates named placeholders', () => {
    expect(translate('en', 'layers.selected', { count: 3 })).toBe('3 selected')
    expect(translate('ps', 'layers.selected', { count: 3 })).toContain('3')
  })

  it('leaves placeholders it was given no value for untouched', () => {
    expect(translate('en', 'layers.selected', { other: 1 })).toBe('{count} selected')
  })
})

// The store reads `window`/`navigator` at module-evaluation time, so each case
// stubs the environment and then re-imports the module.
describe('language store', () => {
  function stubBrowser(options: { stored?: string; languages?: string[] } = {}) {
    const store = new Map<string, string>()
    if (options.stored !== undefined) store.set('pixeldeck.ui-language', options.stored)
    const root: Record<string, string> = {}
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
      },
    })
    vi.stubGlobal('navigator', { languages: options.languages ?? ['en-US'], language: 'en-US' })
    vi.stubGlobal('document', { documentElement: root })
    return { store, root }
  }

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('defaults to English and stamps ltr on the document', async () => {
    const { root } = stubBrowser()
    const { useUiLanguageStore, initUiLanguage } = await import('./index')
    expect(useUiLanguageStore.getState().language).toBe('en')
    initUiLanguage()
    expect(root.dir).toBe('ltr')
    expect(root.lang).toBe('en')
  })

  it('restores a stored language and switches the document to rtl', async () => {
    const { root } = stubBrowser({ stored: 'ps' })
    const { useUiLanguageStore, initUiLanguage } = await import('./index')
    expect(useUiLanguageStore.getState().language).toBe('ps')
    initUiLanguage()
    expect(root.dir).toBe('rtl')
    expect(root.lang).toBe('ps')
  })

  it('ignores a stored value that is not a shipped language', async () => {
    stubBrowser({ stored: 'klingon' })
    const { useUiLanguageStore } = await import('./index')
    expect(useUiLanguageStore.getState().language).toBe('en')
  })

  it('falls back to the browser languages on a first visit', async () => {
    stubBrowser({ languages: ['ps-AF', 'en-US'] })
    const { useUiLanguageStore } = await import('./index')
    expect(useUiLanguageStore.getState().language).toBe('ps')
  })

  it('treats Dari (prs) as Persian', async () => {
    stubBrowser({ languages: ['prs'] })
    const { useUiLanguageStore } = await import('./index')
    expect(useUiLanguageStore.getState().language).toBe('fa')
  })

  it('prefers the stored choice over the browser languages', async () => {
    stubBrowser({ stored: 'en', languages: ['ps-AF'] })
    const { useUiLanguageStore } = await import('./index')
    expect(useUiLanguageStore.getState().language).toBe('en')
  })

  it('persists a chosen language and updates the document direction', async () => {
    const { store, root } = stubBrowser()
    const { useUiLanguageStore } = await import('./index')
    useUiLanguageStore.getState().setLanguage('ps')
    expect(store.get('pixeldeck.ui-language')).toBe('ps')
    expect(root.dir).toBe('rtl')
    useUiLanguageStore.getState().setLanguage('en')
    expect(root.dir).toBe('ltr')
  })

  it('still switches language when storage throws (private mode)', async () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => { throw new Error('blocked') },
        setItem: () => { throw new Error('blocked') },
      },
    })
    vi.stubGlobal('navigator', { languages: ['en-US'], language: 'en-US' })
    vi.stubGlobal('document', { documentElement: {} as Record<string, string> })
    const { useUiLanguageStore } = await import('./index')
    expect(useUiLanguageStore.getState().language).toBe('en')
    expect(() => useUiLanguageStore.getState().setLanguage('fa')).not.toThrow()
    expect(useUiLanguageStore.getState().language).toBe('fa')
  })
})
