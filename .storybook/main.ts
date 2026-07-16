import type { StorybookConfig } from '@storybook/angular';

/**
 * Monorepo-wide Storybook. Stories are co-located with the components in each
 * package; add more globs here as further packages are documented (the goal is
 * to document the whole webstack from this single Storybook).
 */
const config: StorybookConfig = {
  stories: [
    '../ca-ng-components/src/**/*.stories.@(ts|mdx)',
    '../ca-ng-components-extra/src/**/*.stories.@(ts|mdx)',
    './stories/**/*.stories.@(ts|mdx)',
    './stories/**/*.mdx',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
