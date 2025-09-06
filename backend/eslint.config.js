import globals from "globals";
import {defineConfig} from "eslint/config";

export default defineConfig([
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "coverage/**",
            "*.min.js",
            "package-lock.json"
        ],
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: globals.node,
            ecmaVersion: 2022,
            sourceType: "module"
        },
        rules: {
            "no-console": "warn",
            "no-unused-vars": "warn",
            "prefer-const": "error"
        }
    },
]);