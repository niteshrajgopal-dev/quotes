import { defineConfig, globalIgnores } from "eslint/config";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

export default defineConfig([
  globalIgnores([
    ".next/**",
    ".agents/**",
    "node_modules/**",
    "design/**",
    "design_handoff/**",
    "out/**",
    "next-env.d.ts",
  ]),
  coreWebVitals,
  typescript,
]);
