import type { Meta, StoryObj } from '@storybook/angular';
import { of } from 'rxjs';
import { I18nPipe, I18nService, type Mstring } from '../../ca-ng-i18n/src';

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-i18n/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-i18n`, covering service and pipe behavior with resilient fallbacks.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const TranslateMstring: Story = {
  render: () => {
    const locale = { getLocale: () => of('en') } as any;
    const translate = {
      currentLang: 'en',
      use: () => {},
      get: (key: string) => of(key === 'HELLO' ? 'Hello translated' : key),
    } as any;
    const service = new I18nService(locale, translate);

    let translated = '';
    const message: Mstring = { key: 'HELLO', default: 'Hello default' };
    service.get(message).subscribe((value) => (translated = value));

    const details = JSON.stringify({ translated }, null, 2);
    return {
      props: { details },
      template: `
        <section>
          <p>Resolve an <code>Mstring</code> through <code>I18nService</code> in a typed application flow.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const I18nPipeFallback: Story = {
  render: () => {
    const locale = { getLocale: () => of('en') } as any;
    const translate = {
      currentLang: 'en',
      use: () => {},
      get: (_key: string) => of('MISSING_KEY'),
    } as any;
    const service = new I18nService(locale, translate);
    const pipe = new I18nPipe(service);

    const output = pipe.transform({ key: 'MISSING_KEY', default: 'Fallback text' });
    const details = JSON.stringify(
      {
        scenario: 'Missing translation fallback',
        output,
      },
      null,
      2,
    );
    return {
      props: { details },
      template: `
        <section>
          <p>When a key is unavailable, the pipe returns a deterministic default text for UX continuity.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
