import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Target files inside the `src` directory only
  // Apply ESLint's recommended JavaScript rules
  pluginJs.configs.recommended,

  // Apply ESLint's recommended TypeScript rules
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],  // Match files in the `src` directory
    languageOptions: {
      globals: { 
        ...globals.browser, // Recognizes browser-specific globals like console, alert, etc.
        ...globals.node,    // Also include Node.js globals if needed
        ...globals.typescript, // TypeScript-specific globals
        ...globals.jest,      // Jest globals (if you're using Jest for testing)      
      },  // Define globals for browser, node, jest, etc.
    },
    plugins: {
      svelte: eslintPluginSvelte,  // Enable the Svelte plugin for .svelte files
    },
    rules: {
      'no-console': 'off', // Allow console usage in development
    },
    
  },
  
  // Svelte specific configuration
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,  // Use the Svelte parser
      globals: { 
        ...globals.browser, // Recognizes browser-specific globals like console, alert, etc.
        ...globals.node,    // Also include Node.js globals if needed
        ...globals.typescript, // TypeScript-specific globals
        ...globals.jest,      // Jest globals (if you're using Jest for testing)      
      },  // Define globals for browser, node, jest, etc.
      parserOptions: {
        parser: tsParser,  // Use TypeScript parser for .svelte files
        project: 'tsconfig.json',  // Link to your TypeScript config
        extraFileExtensions: ['.svelte'], // Allow Svelte file extensions
      },
    },
    rules: {
      // You can add specific rules for Svelte files here if needed.
    },
  },
  // Ignore specific files and directories globally
  {
    ignores: [
      '.test/*',
      '.config/*',
      '*/.config/*',
      '.d/*',
      'src/js/lib/**/*',
      'src/jsx/lib/**/*',
      'src/jsx/ppro/**/*',
      'legacy/**/*',
      'dist/**/*',
    ],
  },

];
