import type { Meta, StoryObj } from '@storybook/angular';
import { CaepEvent, CaepEventMetadataKey, EventManager } from '../../ca-event-manager/src';

class StorybookEventPublisher {
  @CaepEvent({ name: 'storybook:onSave' })
  save() {
    return;
  }
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'event-manager/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/event-manager`, including domain-event dispatch and decorator metadata inspection.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const DispatchAndListen: Story = {
  render: () => {
    const manager = new EventManager();
    const eventName = 'sales:order-approved';
    let receivedPayload: any[] = [];

    const listener = (event: Event) => {
      receivedPayload = ((event as CustomEvent).detail || []) as any[];
    };

    window.addEventListener(eventName, listener);
    manager.dispatch(eventName, { orderId: 'SO-1001', approvedBy: 'risk-office', correlationId: 'corr-42' });
    window.removeEventListener(eventName, listener);

    const details = JSON.stringify(
      {
        scenario: 'Cross-module domain event',
        eventName,
        payloadReceivedByListener: receivedPayload,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Dispatch a domain event and consume it through a standard DOM listener contract.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const DecoratorMetadata: Story = {
  render: () => {
    const target = StorybookEventPublisher.prototype;
    const metadata = Reflect.getMetadata(CaepEventMetadataKey, target, 'save');

    const details = JSON.stringify(
      {
        scenario: 'Event metadata discovery',
        metadataKey: CaepEventMetadataKey,
        metadata,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Read decorator metadata to support event wiring and diagnostics tooling.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
