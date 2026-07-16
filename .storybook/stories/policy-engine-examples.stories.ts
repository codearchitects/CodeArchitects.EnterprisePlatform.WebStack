import type { Meta, StoryObj } from '@storybook/angular';
import { ClaimType, PolicyEngine, PolicyWrapperHelper, type IPolicy } from '../../ca-policy-engine/src';

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'policy-engine/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/policy-engine`, covering deterministic and reactive authorization checks.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

function createEngineWithClaimsAndPolicies() {
  const engine = new PolicyEngine();

  engine.claims = [{ type: ClaimType.emailAddress, value: 'auditor@acme.test' }];

  const policies: IPolicy[] = [
    {
      type: 'authorization',
      resource: /^entity:\/\/compliance-reports$/,
      selector: 'read',
      condition: { claimType: ClaimType.emailAddress, claimValue: 'auditor@acme.test' },
    },
    {
      type: 'authorization',
      resource: /^entity:\/\/compliance-reports$/,
      selector: 'approve',
      condition: { claimType: ClaimType.role, claimValue: 'admin' },
    },
  ];

  engine.policies = policies;
  return engine;
}

export const RunPolicies: Story = {
  render: () => {
    const engine = createEngineWithClaimsAndPolicies();
    const result = engine.runPolicies<{ read?: boolean; approve?: boolean }>(
      'entity://compliance-reports',
      'read',
      'approve',
    );

    const details = JSON.stringify(result, null, 2);
    return {
      props: { details },
      template: `
        <section>
          <p>Evaluate read/approve permissions for a compliance report in one deterministic call.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const ObservePolicies: Story = {
  render: () => {
    const engine = createEngineWithClaimsAndPolicies();
    const emissions: Array<{ read?: boolean; approve?: boolean }> = [];

    const subscription = engine
      .observePolicies<{ read?: boolean; approve?: boolean }>('entity://compliance-reports', 'read', 'approve')
      .subscribe((value) => emissions.push(value));

    engine.claims = [
      { type: ClaimType.emailAddress, value: 'auditor@acme.test' },
      { type: ClaimType.role, value: 'admin' },
    ];

    subscription.unsubscribe();

    const details = JSON.stringify(
      {
        emissions,
        latest: emissions[emissions.length - 1],
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Reactive authorization stream: adding claims emits a fresh entitlement snapshot.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const WrapJsonPolicies: Story = {
  render: () => {
    const wrapped = PolicyWrapperHelper.wrapJsonPolicies({
      claimsAuthorizationPolicyManager: {
        policy: [
          {
            type: 'authorization',
            resource: 'entity://compliance-reports',
            selector: 'read',
            claim: { claimType: ClaimType.emailAddress, claimValue: 'auditor@acme.test' },
          },
        ],
      },
    });

    const details = JSON.stringify(
      wrapped.map((policy) => ({
        type: policy.type,
        selector: policy.selector,
        resourceMatchesReports: policy.resource.test('entity://compliance-reports'),
      })),
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Convert JSON configuration into executable policies ready for runtime checks.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
