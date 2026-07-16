import type { Meta, StoryObj } from '@storybook/angular';
import { ShBaseReactComponent } from '../../ca-ng-react/src';

type EmptyArgs = Record<string, never>;

class StorybookReactCounter extends ShBaseReactComponent<{ title: string }, { count: number }> {
  constructor(props: { title: string }) {
    super(props);
    this.state = { count: 0 };
  }

  public hasElementRef() {
    return Boolean(this.element);
  }
}

const meta: Meta<EmptyArgs> = {
  title: 'ng-react/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-react`, focused on Angular/React host interoperability.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const BaseReactComponentContract: Story = {
  render: () => {
    const component = new StorybookReactCounter({ title: 'Counter' });
    const emissions: Array<{ count: number }> = [];
    component.change$.subscribe((state) => emissions.push(state));
    component.change$.next({ count: 1 });
    component.change$.next({ count: 2 });

    const details = JSON.stringify(
      {
        scenario: 'Host-bridged state stream',
        hasElementRef: component.hasElementRef(),
        emissions,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Bridge React-side state transitions into Angular host lifecycle via <code>change$</code>.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
