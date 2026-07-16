import type { Meta, StoryObj } from '@storybook/angular';
import { ShGraphQL } from '../../ca-ng-graphql/src/public-api';
import { ShGraphQLFilterOperator, ShGraphQLSortDirection } from '../../ca-ng-graphql/src/models';

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-graphql/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-graphql`, focused on composable query/mutation generation.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const BuildQuery: Story = {
  render: () => {
    const query = ShGraphQL.buildQuery<any, any>(
      'Customers',
      {
        parameters: { tenantId: 10 },
        filtering: { status: { operator: 'eq', value: 'PendingApproval' } },
        filterOperator: ShGraphQLFilterOperator.And,
        sorting: { createdAt: ShGraphQLSortDirection.DESC },
        paging: { pageSize: 10, pageIndex: 2 },
        options: { pageInfo: true, totalCount: true },
      } as any,
      'id',
      'status',
      'createdAt',
    );

    return {
      props: {
        details: JSON.stringify({ scenario: 'Approval queue query', query }, null, 2),
      },
      template: `
        <section>
          <p>Build production-grade GraphQL queries with filtering, sorting, paging and metadata options.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const BuildMutation: Story = {
  render: () => {
    const mutation = ShGraphQL.buildMutation<any>(
      'createCustomer',
      {
        parameters: {
          payload: {
            reportId: 'R-77',
            outcome: ShGraphQL.enumValue({ Approved: 0, Rejected: 1 }, 'Approved'),
          },
        },
      } as any,
      'id',
      'outcome',
    );

    const details = JSON.stringify(
      {
        scenario: 'Compliance decision mutation',
        mutation,
        enumEncoded: ShGraphQL.enumValue({ Approved: 0, Rejected: 1 }, 'Approved'),
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Generate mutation payloads and encode enum literals in GraphQL-compliant form.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
