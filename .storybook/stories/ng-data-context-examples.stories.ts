import type { Meta, StoryObj } from '@storybook/angular';
import { DataContextService } from '../../ca-ng-data-context/src';
import { Entity } from '../../ca-data-context/src';

@Entity({ name: 'Storybook.NgCustomer', keys: 'id' })
class StorybookNgCustomer {
  id = '';
  name = '';
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-data-context/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-data-context`, focused on service-level identity-map orchestration.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const AttachDetachFlow: Story = {
  render: () => {
    const dataContext = new DataContextService();

    const first = Object.assign(new StorybookNgCustomer(), { id: 'C-1', name: 'Alice' });
    const second = Object.assign(new StorybookNgCustomer(), { id: 'C-1', name: 'Alice v2' });

    const attachedFirst = dataContext.attach(first);
    const attachedSecond = dataContext.attach(second);

    dataContext.detach(attachedSecond);

    const third = Object.assign(new StorybookNgCustomer(), { id: 'C-1', name: 'Alice v3' });
    const attachedThird = dataContext.attach(third);

    const details = JSON.stringify(
      {
        scenario: 'Angular service-backed entity cache',
        sameReferenceBeforeDetach: attachedFirst === attachedSecond,
        mergedNameBeforeDetach: attachedSecond.name,
        sameReferenceAfterDetach: attachedSecond === attachedThird,
        nameAfterReattach: attachedThird.name,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Coordinate attach/detach operations through <code>DataContextService</code> while preserving identity semantics.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
