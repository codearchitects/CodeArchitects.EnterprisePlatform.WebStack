// Reflect metadata polyfill — the design-system base classes (policy engine /
// resource service) rely on Reflect.getMetadata, exactly as the real apps load
// it in their polyfills.
import 'core-js/proposals/reflect-metadata';

import { importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ContextService } from '@ca-webstack/ng-aspects';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { applicationConfig, type Preview } from '@storybook/angular';
import { ShTranslateService } from '../ca-ng-components/src/i18n/translate.service';
import { CaepIdSequenceService } from '../ca-ng-components-extra/src/services/id-sequence.service';
import { CaepPipeMapperService } from '../ca-ng-components-extra/src/services/pipe-mapper.service';

/**
 * Global Storybook config.
 *
 * Shared application providers every component needs live here ONCE, so
 * individual stories only declare their component's NgModule via
 * `moduleMetadata`. Key points learned from the real app bootstrap:
 * - i18n is wired via `ShTranslateModule.forRoot()`, which aliases
 *   `TranslateService` to the design-system `ShTranslateService` — components
 *   inject either name, so both must resolve.
 * - a language must be selected at startup (`translate.use`), otherwise
 *   `currentLang` is undefined and services like NumberParserService throw.
 * - CommandDispatcherService is app-scoped (commands-bar, card).
 *
 * The a11y addon runs axe (WCAG 2.2 AA / EN 301 549 — see ACCESSIBILITY.md);
 * the headless gate is `npm run test:a11y`.
 */
const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        // Zone-based change detection (like the real app bootstrap). Without it
        // Storybook can run zoneless, so deferred updates (setTimeout/yieldFunc,
        // e.g. sh-card's `isReady`) never trigger CD and the component stays empty.
        provideZoneChangeDetection({ eventCoalescing: true }),
        importProvidersFrom(TranslateModule.forRoot(), I18nModule.forRoot()),
        // Components that inject the design-system ShTranslateService (e.g. via
        // CaepPopoverService) get the plain ngx-translate instance — enough for
        // stories, and it avoids ShTranslateService's remote-merge override which
        // throws under the story's fake loader.
        { provide: ShTranslateService, useExisting: TranslateService },
        ContextService,
        CommandDispatcherService,
        // ng-components-extra container/base services that are NOT providedIn:'root'
        // (the container module does not provide them at the story level).
        CaepIdSequenceService,
        CaepPipeMapperService,
        provideAnimations(),
        provideRouter([]),
        provideAppInitializer(() => {
          // Set the language WITHOUT calling use()/setDefaultLang(): those trigger
          // ShTranslateService's overridden getTranslation (remote-merge), which
          // returns an undefined stream under the story's fake loader. Direct
          // assignment gives services like NumberParserService a defined
          // `currentLang` without loading translations (keys render as-is).
          const translate = inject(TranslateService);
          translate.addLangs(['en', 'it']);
          translate.currentLang = 'en';
          translate.defaultLang = 'en';
        }),
      ],
    }),
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    options: {
      storySort: (a, b) => {
        const rankSidebarLeaf = (segment) => {
          const normalized = segment.toLowerCase();
          if (normalized === 'docs') return 0;
          if (normalized === 'examples') return 1;
          return 2;
        };

        const aParts = a.title.split('/');
        const bParts = b.title.split('/');
        const maxDepth = Math.max(aParts.length, bParts.length);

        for (let index = 0; index < maxDepth; index++) {
          const left = aParts[index] ?? '';
          const right = bParts[index] ?? '';
          if (left === right) continue;

          if (index === 1) {
            const rankDiff = rankSidebarLeaf(left) - rankSidebarLeaf(right);
            if (rankDiff !== 0) return rankDiff;
          }
          return left.localeCompare(right);
        }
        return 0;
      },
    },
    a11y: {
      config: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      },
      test: 'error',
    },
  },
};

export default preview;
