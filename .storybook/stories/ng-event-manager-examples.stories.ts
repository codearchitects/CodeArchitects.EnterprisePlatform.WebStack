import type { Meta, StoryObj } from '@storybook/angular';
import { CaepEvent } from '../../ca-event-manager/src';
import { CaepEventManagerService } from '../../ca-ng-event-manager/src/public-api';

class StorybookNgEventComponent {
  calls: Array<{ id: number }> = [];

  @CaepEvent({ name: 'storybook:ng-event' })
  onEvent(payload: { id: number }) {
    this.calls.push(payload);
  }
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-event-manager/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-event-manager`, including decorator-driven listener lifecycle management.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const RegisterDecoratedListeners: Story = {
  render: () => {
    const manager = new CaepEventManagerService();
    const component = new StorybookNgEventComponent();

    manager.registerEventListeners(component);
    manager.dispatch('storybook:ng-event', { id: 1 });
    manager.removeEventListeners(component);
    manager.dispatch('storybook:ng-event', { id: 2 });

    const details = JSON.stringify(
      {
        scenario: 'Component-scoped listener registration',
        handledCalls: component.calls,
        handledCount: component.calls.length,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Register decorated handlers at component startup and remove them during teardown.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const RegisterSingleListener: Story = {
  render: () => {
    const manager = new CaepEventManagerService();
    const received: number[] = [];
    const handler = (value: number) => received.push(value);

    manager.registerEventListener('storybook:single-listener', handler);
    manager.dispatch('storybook:single-listener', 10);
    manager.removeEventListener('storybook:single-listener', handler);
    manager.dispatch('storybook:single-listener', 20);

    const details = JSON.stringify({ received }, null, 2);

    return {
      props: { details },
      template: `
        <section>
          <p>Manage imperative listeners when dynamic registration is required.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
