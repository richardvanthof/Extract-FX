import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginSvelte from "eslint-plugin-svelte";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Target files inside the `src` directory only
  {
    files: ["src/**/*.{js,mjs,cjs,ts,svelte}"],  // Match files in the `src` directory
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },  // Define globals for browser and node environments
    },
    plugins: {
      svelte3: eslintPluginSvelte,  // Enable the Svelte plugin for .svelte files
    },
    rules: {
      // Optionally, add specific rules for files inside `src` here
    },
  },
  
  // Ignore specific files and directories globally
  {
    // Ignore pre-made Bolt CEP scripts.
    ignores: [
      '.test/*',
      '.config/*',
      '.d/*',
      'src/js/lib/**/*',
      'src/jsx/lib/**/*',
      'src/jsx/ppro/**/*',
      'legacy/**/*',
      'dist/**/*'
    ],
  },

  // Apply ESLint's recommended JavaScript rules
  pluginJs.configs.recommended,

  // Apply ESLint's recommended TypeScript rules
  ...tseslint.configs.recommended,
];
