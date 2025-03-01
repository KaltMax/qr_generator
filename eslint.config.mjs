import jest from "eslint-plugin-jest";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended", "plugin:jest/recommended"),{
    // Add the ignores property here to exclude files or directories
    ignores: ["coverage/**"],
    plugins: {
        jest,
    },
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.jest,
        },
        ecmaVersion: 2020,
        sourceType: "module",
    },
    rules: {
        "no-unused-vars": ["error"],
        "no-use-before-define": ["error"],
        "no-redeclare": ["error"],
        camelcase: ["off"],
    },
},
];