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
        "@typescript-eslint/unified-signatures": "off",
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
    extends: compat.extends(
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility",
    ),

    // Accessibility gate (WCAG 2.2 AA / EN 301 549 — see ACCESSIBILITY.md).
    // Enforced at "error": the per-component backlog is cleared and the few
    // remaining false positives (custom-ARIA widgets) carry justified inline
    // `eslint-disable-next-line` annotations, so any NEW violation fails CI.
    rules: {
        "@angular-eslint/template/alt-text": "error",
        "@angular-eslint/template/click-events-have-key-events": "error",
        "@angular-eslint/template/elements-content": "error",
        "@angular-eslint/template/interactive-supports-focus": "error",
        "@angular-eslint/template/label-has-associated-control": "error",
        "@angular-eslint/template/mouse-events-have-key-events": "error",
        // `autofocus` is an explicit, documented, default-false opt-in option of
        // the base component API (IShBaseOptions.autofocus); it is only emitted
        // when a consumer deliberately enables it. Flagging every input's
        // [attr.autofocus] binding is noise that masks real issues, so this rule
        // is disabled by design rather than left as a permanent backlog.
        "@angular-eslint/template/no-autofocus": "off",
        "@angular-eslint/template/no-distracting-elements": "error",
        "@angular-eslint/template/role-has-required-aria": "error",
        "@angular-eslint/template/table-scope": "error",
        "@angular-eslint/template/valid-aria": "error",
        // Non-a11y style rule with pre-existing violations (e.g. form-array's
        // ngForTemplate pattern); kept at "warn" so it does not block the a11y
        // gate. Migrate to built-in control flow separately.
        "@angular-eslint/template/prefer-control-flow": "warn",
    },
}]);