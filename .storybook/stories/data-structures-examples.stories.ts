import type { Meta, StoryObj } from '@storybook/angular';
import { DateOnly, Dictionary, List, TimeSpan } from '../../ca-data-structures/src';

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'data-structures/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/data-structures`, showing collection orchestration and temporal calculations.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const ListAndDictionary: Story = {
  render: () => {
    const pendingApprovals = new List<string>();
    pendingApprovals.add('REQ-1001');
    pendingApprovals.addRange(['REQ-1002', 'REQ-1003']);
    pendingApprovals.remove('REQ-1002');
    pendingApprovals.insert(1, 'REQ-1010');

    const riskScores = new Dictionary<string, number>();
    riskScores.set('REQ-1001', 35);
    riskScores.set('REQ-1003', 80);
    riskScores.set('REQ-1010', 55);

    const details = JSON.stringify(
      {
        scenario: 'Approval queue + risk dictionary',
        queue: {
          count: pendingApprovals.count,
          first: pendingApprovals.get(0),
          second: pendingApprovals.get(1),
          containsEscalatedRequest: pendingApprovals.indexOf('REQ-1010') >= 0,
        },
        riskScores: {
          count: riskScores.count,
          keys: riskScores.keys,
          values: riskScores.values,
          containsHighRiskRequest: riskScores.containsKey('REQ-1003'),
          highRiskValue: riskScores.get('REQ-1003'),
        },
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Model queue + lookup-table workflows using <code>List&lt;T&gt;</code> and <code>Dictionary&lt;TKey, TValue&gt;</code>.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const TimeUtilities: Story = {
  render: () => {
    const sprintDuration = TimeSpan.fromMinutes(195);
    const releaseDate = new DateOnly('2026-10-05');

    const details = JSON.stringify(
      {
        scenario: 'Release planning timeline',
        timeSpan: {
          toString: sprintDuration.toString(),
          hours: sprintDuration.hours,
          minutes: sprintDuration.minutes,
          totalHours: sprintDuration.totalHours,
          totalMinutes: sprintDuration.totalMinutes,
        },
        dateOnly: {
          iso: releaseDate.toISOString(),
          year: releaseDate.getUTCFullYear(),
          month: releaseDate.getUTCMonth() + 1,
          day: releaseDate.getUTCDate(),
        },
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Use <code>DateOnly</code> and <code>TimeSpan</code> for timezone-safe release scheduling.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
