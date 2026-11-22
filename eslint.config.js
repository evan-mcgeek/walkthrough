import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/', 'plugin/dist/', 'test-results/', 'playwright-report/'] },
  { files: ['**/*.{js,mjs}'], ...js.configs.recommended, languageOptions: { globals: globals.node } },
  ...tseslint.configs.strictTypeChecked.map(config => ({ ...config, files: ['**/*.ts'] })),
  {
    files: ['**/*.ts'],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
  },
  { files: ['src/page/**/*.ts'], languageOptions: { globals: globals.browser } },
);
