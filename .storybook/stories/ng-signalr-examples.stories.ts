import type { Meta, StoryObj } from '@storybook/angular';
import { Injector } from '@angular/core';
import { ShHubProxy, SignalREvent, SignalRManager, SignalRModule, SignalRLogger } from '../../ca-ng-signalr/src/public_api';

class StorybookSignalRHub extends ShHubProxy {
  public static readonly NAME = 'storybookHub';
  public hubName = StorybookSignalRHub.NAME;

  constructor() {
    super(Injector.create({ providers: [] }));
  }
}

class StorybookSignalRComponent {
  @SignalREvent({ hub: StorybookSignalRHub as any, methodName: 'messageReceived' as any })
  onMessage(_payload: any) {
    return;
  }
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-signalr/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-signalr`, covering module bootstrap and decorator-based event routing.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const ModuleConfiguration: Story = {
  render: () => {
    const moduleConfig = SignalRModule.forRoot('https://api.example.com/', 5);
    const providerTokens = (moduleConfig.providers || []).map((provider: any) =>
      provider?.provide ? String(provider.provide) : provider?.name,
    );

    const details = JSON.stringify(
      {
        scenario: 'SignalR infrastructure bootstrap',
        ngModule: moduleConfig.ngModule?.name,
        providerCount: providerTokens.length,
        providers: providerTokens,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Build SignalR root wiring with <code>SignalRModule.forRoot</code> for enterprise host applications.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const DecoratorRegistration: Story = {
  render: () => {
    new StorybookSignalRComponent();
    const events = SignalRManager.filter((event) => event.hubName === StorybookSignalRHub.NAME);
    const removed = SignalRManager.unregister(StorybookSignalRHub.NAME, 'messageReceived');

    SignalRLogger.log(`registered events: ${events.length}`);

    const details = JSON.stringify(
      {
        scenario: 'Decorator-driven hub event subscription',
        registeredEvents: events.map((item) => ({ hubName: item.hubName, methodName: String(item.methodName) })),
        unregistered: removed,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Register and clean hub events declared via <code>@SignalREvent</code> metadata.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
