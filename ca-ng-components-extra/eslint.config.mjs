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

    rules: {},
}, {
    files: ["**/*.html"],
    extends: compat.extends(
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility",
    ),

    // Accessibility gate (WCAG 2.2 AA / EN 301 549 — see ../ACCESSIBILITY.md).
    // Enforced at "error": the backlog is cleared and the few false positives
    // carry justified inline `eslint-disable-next-line` annotations, so any NEW
    // violation fails CI. `no-autofocus` is off by design (documented opt-in).
    rules: {
        "@angular-eslint/template/alt-text": "error",
        "@angular-eslint/template/click-events-have-key-events": "error",
        "@angular-eslint/template/elements-content": "error",
        "@angular-eslint/template/interactive-supports-focus": "error",
        "@angular-eslint/template/label-has-associated-control": "error",
        "@angular-eslint/template/mouse-events-have-key-events": "error",
        "@angular-eslint/template/no-autofocus": "off",
        "@angular-eslint/template/no-distracting-elements": "error",
        "@angular-eslint/template/role-has-required-aria": "error",
        "@angular-eslint/template/table-scope": "error",
        "@angular-eslint/template/valid-aria": "error",
        // Non-a11y style rule; kept at "warn" so it does not block the a11y gate.
        "@angular-eslint/template/prefer-control-flow": "warn",
    },
}]);
