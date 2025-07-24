import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ Default Next.js + TS config
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Add your overrides
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",     // Allow 'any' type
      "@typescript-eslint/no-unused-vars": "warn",     // Show warning instead of error
      "@typescript-eslint/ban-ts-comment": "warn",     // Allow @ts-ignore, but warn
      "react-hooks/exhaustive-deps": "warn",           // Warn for missing deps
    },
  },
];

export default eslintConfig;
