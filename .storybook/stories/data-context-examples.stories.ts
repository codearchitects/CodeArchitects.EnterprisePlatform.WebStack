import type { Meta, StoryObj } from '@storybook/angular';
import { DataContext, Entity, IgnoreIfExistsStrategy, OverwriteAlwaysStrategy } from '../../ca-data-context/src';

@Entity({ name: 'Storybook.Customer', keys: 'id' })
class StorybookCustomer {
  id = '';
  name = '';
}

@Entity({ name: 'Storybook.Order', keys: 'id' })
class StorybookOrder {
  id = '';
  customer = new StorybookCustomer();
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'data-context/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/data-context`, focused on identity-map deduplication and merge governance.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const IdentityMapAndOverwrite: Story = {
  render: () => {
    const context = new DataContext();

    const first = Object.assign(new StorybookCustomer(), { id: 'C-1', name: 'Acme Retail' });
    const second = Object.assign(new StorybookCustomer(), { id: 'C-1', name: 'Acme Retail Group' });

    const attachedFirst = context.attach(first);
    const attachedSecond = context.attach(second, new OverwriteAlwaysStrategy());

    const details = JSON.stringify(
      {
        scenario: 'CRM customer upsert',
        sameReference: attachedFirst === attachedSecond,
        mergedName: attachedSecond.name,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Upsert flows keep one canonical in-memory instance while applying an overwrite merge strategy.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const IgnoreIfExistsMergeStrategy: Story = {
  render: () => {
    const context = new DataContext();

    const originalCustomer = Object.assign(new StorybookCustomer(), { id: 'C-2', name: 'Strategic Account' });
    const originalOrder = Object.assign(new StorybookOrder(), { id: 'O-1', customer: originalCustomer });

    const incomingCustomer = Object.assign(new StorybookCustomer(), { id: 'C-2', name: 'Imported Snapshot Name' });
    const incomingOrder = Object.assign(new StorybookOrder(), { id: 'O-2', customer: incomingCustomer });

    context.attach(originalOrder);
    const attachedOrder = context.attach(incomingOrder, new IgnoreIfExistsStrategy());

    const details = JSON.stringify(
      {
        scenario: 'Protect manually curated master data',
        deduplicatedCustomer: attachedOrder.customer === originalCustomer,
        customerNameAfterMerge: attachedOrder.customer.name,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p><code>IgnoreIfExistsStrategy</code> preserves trusted local values when importing duplicate entities.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
