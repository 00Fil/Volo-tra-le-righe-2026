import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },
];

export default eslintConfig;
