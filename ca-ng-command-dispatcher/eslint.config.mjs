import { defineConfig, globalIgnores } from "eslint/config";
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

export default defineConfig([globalIgnores(["projects/**/*", "src/test.ts", "**/*.spec.ts"]), {
    files: ["**/*.ts"],

    extends: compat.extends(
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
    ),

    languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",

        parserOptions: {
            project: ["tsconfig.json"],
            createDefaultProgram: true,
        },
    },

    rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/dot-notation": "off",

        "@typescript-eslint/explicit-member-accessibility": ["off", {
            accessibility: "explicit",
        }],

        "@typescript-eslint/no-inferrable-types": ["off", {
            ignoreParameters: true,
        }],

        "@typescript-eslint/no-shadow": ["off", {
            hoist: "all",
        }],

        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "arrow-body-style": "off",
        "brace-style": ["error", "1tbs"],
        curly: "off",
        "guard-for-in": "off",
        "id-blacklist": "off",
        "id-match": "off",

        "max-len": ["error", {
            code: 250,
        }],

        "no-underscore-dangle": "off",
        "valid-typeof": "error",
    },
}, {
    files: ["**/*.html"],
    extends: compat.extends("plugin:@angular-eslint/template/recommended"),
    rules: {},
}]);