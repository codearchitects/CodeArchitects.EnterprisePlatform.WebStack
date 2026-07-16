import type { Meta, StoryObj } from '@storybook/angular';
import { ClaimType } from '../../ca-policy-engine/src';
import { PolicyEngineService, Resource, ResourceService } from '../../ca-ng-policy-engine/src';

@Resource({ uri: 'entity://customers' })
class StorybookCustomerResource {}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-policy-engine/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-policy-engine`, including JSON policy bootstrap and resource metadata lookup.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const RunPoliciesFromJson: Story = {
  render: () => {
    const service = new PolicyEngineService();
    service.setJsonClaims([{ type: ClaimType.role, value: 'admin' } as any]);
    service.setJsonPolicies([
      {
        type: 'authorization',
        resource: 'entity://customers',
        selector: 'canApproveCreditLimit',
        claim: { claimType: ClaimType.role, claimValue: 'admin' },
      } as any,
    ]);

    const result = service.runPolicies<{ canApproveCreditLimit?: boolean }>(
      'entity://customers',
      'canApproveCreditLimit',
    );
    const details = JSON.stringify(
      {
        scenario: 'Customer risk authorization',
        result,
      },
      null,
      2,
    );
    return {
      props: { details },
      template: `
        <section>
          <p>Bootstrap claims/policies from JSON and evaluate domain-specific authorization selectors.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const ResolveResourceDecorator: Story = {
  render: () => {
    const resourceService = new ResourceService();
    const resource = resourceService.getResource(StorybookCustomerResource);
    const details = JSON.stringify(resource, null, 2);

    return {
      props: { details },
      template: `
        <section>
          <p>Resolve resource URIs emitted by <code>@Resource</code> for policy routing.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
