import { Injector } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { CAEP_SERIALIZER_CONFIG, SerializerService } from '../../ca-ng-serializer/src';

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-serializer/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-serializer`, including DI-driven serialization and configurable metadata strategy.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const SerializeAndDeserialize: Story = {
  render: () => {
    const injector = Injector.create({ providers: [SerializerService] });
    const serializer = injector.get(SerializerService);
    const payload = { id: 10, workflow: 'onboarding', tags: ['risk-check', 'kyc'] };
    const serialized = serializer.serialize(payload) as string;
    const deserialized = serializer.deserialize(serialized);

    const details = JSON.stringify(
      {
        scenario: 'Audit payload persistence',
        serialized,
        deserialized,
      },
      null,
      2,
    );
    return {
      props: { details },
      template: `
        <section>
          <p>Round-trip domain payloads via <code>SerializerService</code> in an Angular DI context.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const ConfigureViaToken: Story = {
  render: () => {
    const injector = Injector.create({
      providers: [
        { provide: CAEP_SERIALIZER_CONFIG, useValue: { disableMetadata: true } },
        SerializerService,
      ],
    });
    const serializer = injector.get(SerializerService);
    const serialized = serializer.serialize({ id: 1, name: 'No metadata' }) as string;

    const details = JSON.stringify(
      {
        scenario: 'Metadata-free transport mode',
        hasTypeMetadata: serialized.includes('$type'),
        serialized,
      },
      null,
      2,
    );
    return {
      props: { details },
      template: `
        <section>
          <p>Apply serializer policy overrides through <code>CAEP_SERIALIZER_CONFIG</code>.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
