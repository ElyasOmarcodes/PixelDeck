/**
 * UI language for the editor chrome.
 *
 * Deliberately separate from `project.settings.locales` / `activeLocale`, which
 * describe the *designs* being localized. Switching the interface to Pashto
 * must not touch a single slide, so this lives in its own tiny store persisted
 * to localStorage rather than in the project document.
 */

import { create } from 'zustand'
import { en, type TranslationKey } from './locales/en'
import { ps } from './locales/ps'
import { fa } from './locales/fa'

export type { TranslationKey }

export type UiLanguage = 'en' | 'ps' | 'fa'

export type TextDirection = 'ltr' | 'rtl'

export interface UiLanguageMeta {
  code: UiLanguage
  /** Name in English, for the settings list. */
  label: string
  /** Name in the language itself — what a speaker actually looks for. */
  nativeLabel: string
  dir: TextDirection
}

export const UI_LANGUAGES: UiLanguageMeta[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'ps', label: 'Pashto', nativeLabel: 'پښتو', dir: 'rtl' },
  { code: 'fa', label: 'Persian / Dari', nativeLabel: 'فارسی / دری', dir: 'rtl' },
]

const DICTIONARIES: Record<UiLanguage, Record<TranslationKey, string>> = { en, ps, fa }

const STORAGE_KEY = 'pixeldeck.ui-language'

export function getLanguageMeta(code: UiLanguage): UiLanguageMeta {
  return UI_LANGUAGES.find((l) => l.code === code) ?? UI_LANGUAGES[0]
}

function isUiLanguage(value: unknown): value is UiLanguage {
  return typeof value === 'string' && UI_LANGUAGES.some((l) => l.code === value)
}

/**
 * Reads the stored choice, falling back to the browser's languages so a Pashto
 * or Persian speaker lands in their own language on first visit.
 */
function detectInitialLanguage(): UiLanguage {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isUiLanguage(stored)) return stored
  } catch {
    // Private mode / blocked storage — fall through to navigator detection.
  }
  const preferred = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []
  for (const tag of preferred) {
    const base = tag?.toLowerCase().split('-')[0]
    if (base === 'ps') return 'ps'
    // Dari (prs) and Persian (fa) share the Persian dictionary.
    if (base === 'fa' || base === 'prs') return 'fa'
  }
  return 'en'
}

/**
 * Reflects the language on <html> so the browser hyphenates, spell-checks and
 * lays out (RTL) correctly, and so CSS can key off [dir='rtl'].
 */
function applyDocumentLanguage(code: UiLanguage): void {
  if (typeof document === 'undefined') return
  const meta = getLanguageMeta(code)
  document.documentElement.lang = code
  document.documentElement.dir = meta.dir
}

interface UiLanguageState {
  language: UiLanguage
  setLanguage: (code: UiLanguage) => void
}

export const useUiLanguageStore = create<UiLanguageState>((set) => ({
  language: detectInitialLanguage(),
  setLanguage: (code) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // Non-fatal: the choice just won't survive a reload.
    }
    applyDocumentLanguage(code)
    set({ language: code })
  },
}))

/** Call once on startup so the first paint already has the right lang/dir. */
export function initUiLanguage(): void {
  applyDocumentLanguage(useUiLanguageStore.getState().language)
}

/** `{count}`-style placeholder interpolation — enough for this dictionary. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}

export type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string

/**
 * Look up one string in a given language. Missing entries fall back to English
 * rather than rendering a raw key, so a half-translated locale still ships.
 * Exported (rather than living inside `useT`) so it is callable outside React —
 * stores, utilities and tests all use it.
 */
export function translate(
  language: UiLanguage,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  return interpolate(DICTIONARIES[language][key] || en[key], vars)
}

/** Translator bound to the active UI language. */
export function useT(): Translate {
  const language = useUiLanguageStore((s) => s.language)
  return (key, vars) => translate(language, key, vars)
}

/** Text direction of the active UI language — for components that need it in JS. */
export function useUiDirection(): TextDirection {
  return getLanguageMeta(useUiLanguageStore((s) => s.language)).dir
}
