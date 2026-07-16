import type { Meta, StoryObj } from '@storybook/angular';
import { Command, CommandDispatcherService, type ICommand } from '../../ca-ng-command-dispatcher/src/public-api';

class StorybookCommandSource {
  public canExecute = true;

  @Command({ name: 'save', label: 'Save', enabled: 'canExecute', visible: 'canExecute' })
  public onSave(payload: { id: number }) {
    return `saved:${payload.id}`;
  }

  public shCommands(): ICommand[] {
    return [];
  }
}

type EmptyArgs = Record<string, never>;

const meta: Meta<EmptyArgs> = {
  title: 'ng-command-dispatcher/Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise-ready examples for `@ca-webstack/ng-command-dispatcher`, covering command discovery and execution flow.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<EmptyArgs>;

export const CollectAndRunCommands: Story = {
  render: () => {
    const dispatcher = new CommandDispatcherService();
    const source = new StorybookCommandSource();
    let latestCommands: ICommand[] = [];

    dispatcher.changes.subscribe((commands) => (latestCommands = commands));
    dispatcher.add(source as any);
    const result = dispatcher.run('save', { id: 7 });

    const details = JSON.stringify(
      {
        scenario: 'Toolbar command execution pipeline',
        commandCount: latestCommands.length,
        commandNames: latestCommands.map((item) => item.name),
        runResult: result,
      },
      null,
      2,
    );

    dispatcher.remove(source as any);

    return {
      props: { details },
      template: `
        <section>
          <p>Register command providers, react to catalog updates, and execute selected commands.</p>
          <pre>{{ details }}</pre>
        </section>
      `,
    };
  },
};
