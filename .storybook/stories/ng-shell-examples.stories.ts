import type { Meta, StoryObj } from '@storybook/angular';
import { EntityState, toArray, toQueryParams } from '../../ca-ng-shell/src/public-api';

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-shell/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-shell`, focused on utility helpers for routing and entity lifecycle.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const UtilityFunctions: Story = {
  render: () => {
    const single = toArray('alpha');
    const many = toArray(['alpha', 'beta']);
    const query = toQueryParams({ taskId: '42', mode: 'edit' });

    const details = JSON.stringify(
      {
        scenario: 'Shell route normalization',
        toArraySingle: single,
        toArrayMany: many,
        queryParams: query,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Normalize shell inputs and build deterministic query strings for navigation/state restore.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const EntityStateEnum: Story = {
  render: () => {
    const details = JSON.stringify(
      {
        scenario: 'Entity lifecycle constants',
        ready: EntityState.Ready,
        updatePending: EntityState.UpdatePending,
        deleted: EntityState.Deleted,
        disabled: EntityState.Disabled,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Reference shared entity states used by shell services and components.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
