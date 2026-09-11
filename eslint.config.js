import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Build output only. `src-tauri/target` and `android/`, `ios/` hold generated
  // native-shell artifacts — including Tauri's embedded asset copies, which are
  // gzipped blobs with a .js extension and would otherwise fail to parse.
  globalIgnores([
    'dist',
    'src-tauri/target',
    'src-tauri/gen',
    'android',
    'ios',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
