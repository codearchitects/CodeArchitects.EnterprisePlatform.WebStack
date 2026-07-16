import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShModalComponent } from './modal.component';

/**
 * `sh-modal` is a centered, overlay **dialog**. It is shown while its `[model]`
 * flag is truthy and emits `(modelChange)` (two-way `[(model)]`) when it closes.
 * The header/body can be supplied either via the `title` / `body` inputs (both
 * run through the `translate` pipe) or via projected content
 * (`<div header>` / `<div body>` / `<div footer>`). When no `[footer]` content
 * is projected it renders default *cancel* / *confirm* buttons whose visibility
 * is controlled by `hasCancelButton` / `hasConfirmButton`.
 *
 * On init the component moves its root element to `document.body`, so an open
 * dialog covers the full viewport. Because of that (and because the autodocs
 * page renders every story inline) each story here starts **closed** and is
 * opened by an explicit *Open dialog* trigger button; the modal is gated behind
 * an `@if` flag that two-way-binds to `[(model)]`, so it is only created — and
 * only appended to `document.body` — once you click, and is torn down again on
 * cancel/confirm/close.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Renders `role="dialog"` + `aria-modal="true"`; the accessible name comes
 *   from the header (`aria-labelledby`) or from `options.ariaLabel`, and the
 *   body is linked via `aria-describedby`.
 * - Focus is trapped inside the dialog (`cdkTrapFocus` with auto-capture) and
 *   `Esc` triggers cancel/close.
 */
const meta: Meta<ShModalComponent> = {
  title: 'ng-components/Modal',
  component: ShModalComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    title: { control: 'text', description: 'Header title (translated)' },
    body: { control: 'text', description: 'Body text (translated)' },
    icon: { control: 'text', description: 'Optional icon shown before the title' },
    cancelText: { control: 'text', description: 'Cancel button label' },
    confirmText: { control: 'text', description: 'Confirm button label' },
    hasCancelButton: { control: 'boolean', description: 'Render the default cancel button' },
    hasConfirmButton: { control: 'boolean', description: 'Render the default confirm button' },
    closeOnConfirm: { control: 'boolean' },
    closeOnCancel: { control: 'boolean' },
    closeOnClickOutside: { control: 'boolean' },
    confirm: { action: 'confirm' },
    cancel: { action: 'cancel' },
    modelChange: { action: 'modelChange' },
  },
  args: {
    title: 'Confirm action',
    body: 'Are you sure you want to proceed with this action?',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    hasCancelButton: true,
    hasConfirmButton: true,
    closeOnConfirm: true,
    closeOnCancel: true,
    closeOnClickOutside: false,
  },
  render: (args) => ({
    props: { ...args, open: false },
    template: `
      <sh-button [primary]="true" (clicked)="open = true">Open dialog</sh-button>
      @if (open) {
        <sh-modal
          [title]="title"
          [body]="body"
          [icon]="icon"
          [cancelText]="cancelText"
          [confirmText]="confirmText"
          [hasCancelButton]="hasCancelButton"
          [hasConfirmButton]="hasConfirmButton"
          [closeOnConfirm]="closeOnConfirm"
          [closeOnCancel]="closeOnCancel"
          [closeOnClickOutside]="closeOnClickOutside"
          [(model)]="open"
          (confirm)="confirm($event)"
          (cancel)="cancel($event)"
          (modelChange)="modelChange($event)"
        ></sh-modal>
      }
    `,
  }),
};
export default meta;

type Story = StoryObj<ShModalComponent>;

/** Default confirmation dialog with cancel + confirm buttons. */
export const Default: Story = {};

/** Header title flanked by a leading icon. */
export const WithIcon: Story = {
  args: { icon: 'info', title: 'Information' },
};

/** Acknowledgement dialog: only the confirm button is shown. */
export const ConfirmOnly: Story = {
  args: {
    title: 'Saved',
    body: 'Your changes have been saved successfully.',
    hasCancelButton: false,
    confirmText: 'OK',
  },
};

/** Destructive action with custom button labels. */
export const CustomButtonLabels: Story = {
  args: {
    icon: 'warning',
    title: 'Delete item',
    body: 'This will permanently delete the item. This action cannot be undone.',
    cancelText: 'Keep',
    confirmText: 'Delete',
  },
};

/** Longer body copy to show how the dialog grows with its content. */
export const LongContent: Story = {
  args: {
    title: 'Terms and conditions',
    body:
      'Please review the following terms before continuing. ' +
      'By selecting confirm you agree to the processing of your data ' +
      'in accordance with the platform privacy policy and the applicable ' +
      'data-retention rules described in the documentation.',
  },
};

/**
 * Custom projected content instead of the `body` / default footer inputs.
 * When `[footer]` content is projected the default buttons are not rendered.
 */
export const ProjectedContent: Story = {
  render: (args) => ({
    props: { ...args, open: false },
    template: `
      <sh-button [primary]="true" (clicked)="open = true">Open dialog</sh-button>
      @if (open) {
        <sh-modal [title]="title" [(model)]="open"
          (confirm)="confirm($event)" (cancel)="cancel($event)">
          <div body>
            <p>Fully custom body content projected into the dialog.</p>
            <sh-text [model]="{ field: '' }" prop="field"
              [options]="{ placeholder: 'Your name' }"></sh-text>
          </div>
          <div footer>
            <sh-button (clicked)="open = false; cancel($event)">Dismiss</sh-button>
          </div>
        </sh-modal>
      }
    `,
  }),
  args: { title: 'Custom content' },
};
