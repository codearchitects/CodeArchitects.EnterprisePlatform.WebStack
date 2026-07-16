import type { Meta, StoryObj } from '@storybook/angular';
import { Aspect, AspectHelper, Context, ContextService } from '../../ca-ng-aspects/src/public-api';

class StorybookCustomerModel {
  @Aspect({
    default: { label: 'Name', template: 'sh-text' },
    browse: { label: 'Customer name' },
    edit: { label: 'Customer name (editable)' },
  })
  public name = '';
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-aspects/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-aspects`, including metadata extraction and runtime context transitions.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const AspectMetadataExtraction: Story = {
  render: () => {
    const helper = new AspectHelper();
    const details = JSON.stringify(
      {
        scenario: 'Dynamic form rendering metadata',
        defaultLabel: helper.getLabel(StorybookCustomerModel, 'name'),
        browseLabel: helper.getLabel(StorybookCustomerModel, 'name', Context.browse),
        editTemplate: helper.getTemplate(StorybookCustomerModel, 'name', Context.edit),
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Resolve labels/templates from <code>@Aspect</code> metadata to drive UI composition.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};

export const ContextServiceFlow: Story = {
  render: () => {
    const contextService = new ContextService();
    const events: string[] = [];
    contextService.contextChange.subscribe((value) => events.push(value as unknown as string));

    const beforeEnable = contextService.context;
    contextService.enable();
    contextService.context = Context.edit;
    const afterEnable = contextService.context;
    contextService.disable();
    const afterDisable = contextService.context;

    const details = JSON.stringify(
      {
        scenario: 'Form context transition tracking',
        beforeEnable,
        afterEnable,
        afterDisable,
        emittedContexts: events,
      },
      null,
      2,
    );

    return {
      props: { details },
      template: `
        <section>
          <p>Control browse/edit context in a centralized service and observe emitted transitions.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
