import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShCardComponent } from './card.component';

/**
 * `sh-card` is a container component that lays out a titled panel with a
 * toolbar, a (content-projected) body and a footer with cancel/confirm buttons.
 * It wraps its content in an `sh-form`, binding to a `[model]` (or a
 * `[parent]`/`[prop]` pair) so the confirm button is enabled only while the
 * form is valid. Content is projected into the default slot (body) and the
 * named `[toolbar]`, `[command]` and `[footer]` slots.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The card exposes `role="group"`; when a `title` is set it is referenced via
 *   `aria-labelledby`, otherwise an `aria-label` is used.
 * - Toolbar command icons are keyboard-operable (`role="button"`, `tabindex`,
 *   Enter/Space handlers) and expose their name via `aria-label`.
 */
const meta: Meta<ShCardComponent<any>> = {
  title: 'ng-components/Card',
  component: ShCardComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    title: { control: 'text', description: 'Card title (translated)' },
    hasConfirmButton: { control: 'boolean', description: 'Show the confirm button' },
    hasCancelButton: { control: 'boolean', description: 'Show the cancel button' },
    hasIndentedContent: { control: 'boolean', description: 'Indent the body content' },
    isScrollable: { control: 'boolean', description: 'Make the body scrollable' },
    confirmText: { control: 'text', description: 'Confirm button label' },
    cancelText: { control: 'text', description: 'Cancel button label' },
    commandsFamily: { control: 'text', description: 'Commands-bar family key' },
    cancel: { action: 'cancel' },
    confirm: { action: 'confirm' },
    valueChanges: { action: 'valueChanges' },
  },
  args: {
    title: 'Details',
    hasConfirmButton: true,
    hasCancelButton: true,
    hasIndentedContent: true,
    isScrollable: true,
    confirmText: 'confirm',
    cancelText: 'cancel',
  },
  render: (args) => ({
    props: { ...args, model: (args as any).model ?? {}, body: (args as any).body ?? 'Card content goes here.' },
    template: `
      <sh-card
        [model]="model"
        [title]="title"
        [hasConfirmButton]="hasConfirmButton"
        [hasCancelButton]="hasCancelButton"
        [hasIndentedContent]="hasIndentedContent"
        [isScrollable]="isScrollable"
        [confirmText]="confirmText"
        [cancelText]="cancelText"
        (cancel)="cancel($event)"
        (confirm)="confirm($event)"
        (valueChanges)="valueChanges($event)"
      >{{ body }}</sh-card>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShCardComponent<any> & { body?: string; model?: any }>;

/** Default card with a title, body content and both footer buttons. */
export const Default: Story = {};

/** Card without a title (falls back to an `aria-label` for the group). */
export const NoTitle: Story = {
  args: { title: '' },
};

/** Body only — both footer buttons hidden. */
export const NoFooterButtons: Story = {
  args: { hasConfirmButton: false, hasCancelButton: false },
};

/** Confirm button only (e.g. an acknowledge-style card). */
export const ConfirmOnly: Story = {
  args: { hasCancelButton: false, confirmText: 'ok' },
};

/** Custom footer button labels. */
export const CustomButtonLabels: Story = {
  args: { confirmText: 'save', cancelText: 'discard' },
};

/** Non-indented body content. */
export const FlushContent: Story = {
  args: { hasIndentedContent: false },
};
