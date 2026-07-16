import type { Meta, StoryObj } from '@storybook/angular';
import {
  Activator,
  JsonIgnore,
  JsonObject,
  JsonProperty,
  Serializer,
  Type,
  atob,
  btoa,
} from '../../ca-reflection/src';

@JsonObject({ name: 'Storybook.Reflection.Address' })
class StorybookAddress {
  @JsonProperty() city = '';
  @JsonProperty() postalCode = '';
}

@JsonObject({ name: 'Storybook.Reflection.Person' })
class StorybookPerson {
  @JsonProperty() id = 0;
  @JsonProperty() firstName = '';
  @JsonProperty() lastName = '';
  @JsonProperty() address = new StorybookAddress();
  @JsonIgnore() internalNotes = '';
}

class StorybookManualType {
  label = 'created by Activator';
}

type ReflectionDocsArgs = {
  firstName: string;
  lastName: string;
  city: string;
  rawText: string;
};

function prettyJson(serialized: string): string {
  try {
    return JSON.stringify(JSON.parse(serialized), null, 2);
  } catch {
    return serialized;
  }
}

const meta: Meta<ReflectionDocsArgs> = {
  title: 'reflection/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Hands-on examples for `@ca-webstack/reflection`: serializer round-trip, `Type` + `Activator`, and Base64 helpers.',
      },
    },
  },
  args: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    city: 'London',
    rawText: 'CodeArchitects WebStack',
  },
};

export default meta;

type Story = StoryObj<ReflectionDocsArgs>;

export const SerializerRoundTrip: Story = {
  name: 'Serializer round-trip',
  render: (args) => {
    const serializer = new Serializer();
    const person = new StorybookPerson();
    person.id = 42;
    person.firstName = args.firstName;
    person.lastName = args.lastName;
    person.address = Object.assign(new StorybookAddress(), {
      city: args.city,
      postalCode: 'SW1A 1AA',
    });
    person.internalNotes = 'must not be serialized';

    const serialized = serializer.serialize(person) as string;
    const restored = serializer.deserialize(serialized) as StorybookPerson;

    return {
      props: {
        serialized: prettyJson(serialized),
        restored: JSON.stringify(restored, null, 2),
      },
      template: `
        <section>
          <p>Input: object decorated with <code>@JsonObject</code>, <code>@JsonProperty</code> and <code>@JsonIgnore</code>.</p>
          <h4>Serialized</h4>
          <pre>{{ serialized }}</pre>
          <h4>Deserialized</h4>
          <pre>{{ restored }}</pre>
        </section>
      `,
    };
  },
};

export const TypeAndActivator: Story = {
  name: 'Type cache + Activator',
  render: () => {
    const typeName = 'Storybook.Reflection.ManualType';
    Type.CacheType(typeName, StorybookManualType);
    const instance = Activator.createInstance<StorybookManualType>(typeName, true);
    const details = JSON.stringify(
      {
        registeredName: Type.GetName(instance),
        constructorName: instance.constructor.name,
        instanceLabel: instance.label,
      },
      null,
      2,
    );

    return {
      props: {
        details,
      },
      template: `
        <section>
          <p>Manual registration via <code>Type.CacheType</code> and instantiation via <code>Activator.createInstance</code>.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const Base64Helpers: Story = {
  name: 'btoa / atob',
  render: (args) => {
    const encoded = btoa(args.rawText);
    const decoded = atob(encoded);
    const details = JSON.stringify(
      {
        input: args.rawText,
        encoded,
        decoded,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Cross-platform Base64 helpers (browser and non-browser runtime).</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
