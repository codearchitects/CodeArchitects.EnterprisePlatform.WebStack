import type { Meta, StoryObj } from '@storybook/angular';
import {
  ObjectChangeTracker,
  ObjectState,
  ObjectWithChangeTrackerExtensions,
  type IObjectWithChangeTracker,
} from '../../ca-change-tracker/src';

class StorybookTrackableEntity implements IObjectWithChangeTracker {
  changeTracker = new ObjectChangeTracker();
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'change-tracker/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/change-tracker`, with audit-friendly state transitions and tracking controls.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const StateTransitions: Story = {
  render: () => {
    const entity = new StorybookTrackableEntity();
    const transitions: string[] = [];

    entity.changeTracker.objectStateChangingFn = ({ newState }) => {
      transitions.push(ObjectState[newState]);
    };

    ObjectWithChangeTrackerExtensions.markAsAdded(entity);
    ObjectWithChangeTrackerExtensions.markAsModified(entity);
    ObjectWithChangeTrackerExtensions.markAsDeleted(entity);
    ObjectWithChangeTrackerExtensions.markAsUnchanged(entity);

    const details = JSON.stringify(
      {
        scenario: 'Back-office entity lifecycle',
        finalState: ObjectState[entity.changeTracker.state],
        transitions,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Track lifecycle transitions for entities that must remain auditable end-to-end.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const EnableDisableTracking: Story = {
  render: () => {
    const entity = new StorybookTrackableEntity();

    ObjectWithChangeTrackerExtensions.startTracking(entity);
    const afterStart = entity.changeTracker.changeTrackingEnabled;

    ObjectWithChangeTrackerExtensions.stopTracking(entity);
    const afterStop = entity.changeTracker.changeTrackingEnabled;

    const details = JSON.stringify(
      {
        scenario: 'Bulk import without noisy deltas',
        afterStartTracking: afterStart,
        afterStopTracking: afterStop,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Enable tracking for normal operations and disable it during controlled bulk updates.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
