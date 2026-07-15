import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShValidationMessageComponent } from './validation-message.component';

/**
 * `sh-validation-message` renders the validation feedback for a single form
 * control. It binds to a `[model]` object and a `[prop]` key (or a `[parent]`),
 * looks up the matching form control via the form handler, and — **only once
 * that control has been `touched`** — lists its current errors (and, when there
 * are no errors, its warnings) mapped to human-readable text.
 *
 * The visible message text for each error/warning key comes from
 * `options.messages` (e.g. `{ required: 'Name is required' }`); a set of
 * built-in defaults covers the common `number` / `date` / `pattern` / `mask`
 * keys. `options.showValidationMessage` (default `true`) can hide the block
 * entirely.
 *
 * In real usage this component sits directly beneath a form control
 * (`sh-text`, `sh-select`, …) that shares the same `[model]`/`[prop]`, so the
 * errors it shows are the ones produced by that control's validators. To make
 * the feedback visible in isolation, the stories below place the control into a
 * touched + errored state after render (this is what a user blurring an invalid
 * field would do).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The message container is a live region (`role="alert"` + `aria-atomic`) so
 *   assistive technology announces validation feedback as it appears.
 * - The container carries a stable `id` (`<id>-error`) so the associated
 *   control can point at it via `aria-describedby`.
 * - Errors are only surfaced after interaction (`touched`), matching the APG
 *   guidance of not announcing errors on pristine fields.
 */

/**
 * Story-only host: renders the validation message for a model/prop and, after
 * the view initialises, drives the underlying control into the state a user
 * would reach by interacting with (and leaving) an invalid field — i.e. sets
 * the errors/warnings and (optionally) marks it `touched` so the live region
 * renders. This is the minimal host wiring the component needs to render its
 * feedback standalone.
 */
@Component({
  selector: 'story-validation-message-host',
  standalone: false,
  template: `
    <div style="max-width: 380px;">
      <sh-validation-message
        [model]="model"
        [prop]="prop"
        [options]="options"
        (valueChanges)="valueChanges($event)"
      ></sh-validation-message>
    </div>
  `,
})
class ValidationMessageStoryHost implements AfterViewInit {
  @Input() model: { [id: string]: any } = { field: '' };
  @Input() prop = 'field';
  @Input() options: any = {};
  /** Error keys to surface, e.g. `{ required: true }`. */
  @Input() errors: { [key: string]: any } | null = { required: true };
  /** Warning keys to surface (only shown when there are no errors). */
  @Input() warnings: { [key: string]: any } | null = null;
  /** When false the control stays pristine, so nothing is announced. */
  @Input() touch = true;
  @Input() valueChanges: (value: any) => void = () => {};

  @ViewChild(ShValidationMessageComponent)
  private message?: ShValidationMessageComponent<any, any>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Defer to a fresh macrotask to avoid ExpressionChangedAfterItHasBeenChecked
    // and to mirror the async nature of a real blur/validate cycle.
    setTimeout(() => {
      const control = this.message?.control as any;
      if (!control) {
        return;
      }
      if (this.warnings) {
        // ShFormControl.warnings is read-only in TS but populated at runtime by
        // the warning validators; emulate that here for the story.
        control.warnings = this.warnings;
      }
      control.setErrors(this.errors ?? null);
      if (this.touch) {
        control.markAsTouched();
      }
      this.cdr.detectChanges();
    });
  }
}

const meta: Meta<ValidationMessageStoryHost> = {
  title: 'ng-components/ValidationMessage',
  component: ShValidationMessageComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [ValidationMessageStoryHost],
      imports: [ShComponentsModule],
    }),
  ],
  argTypes: {
    prop: { control: 'text', description: 'Model property the message is bound to' },
    valueChanges: { action: 'valueChanges' },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <story-validation-message-host
        [model]="model"
        [prop]="prop"
        [options]="options"
        [errors]="errors"
        [warnings]="warnings"
        [touch]="touch"
        (valueChanges)="valueChanges($event)"
      ></story-validation-message-host>
    `,
  }),
};
export default meta;

type Story = StoryObj<ValidationMessageStoryHost>;

/**
 * A required field left empty after being touched. The `required` key is mapped
 * to readable text through `options.messages`.
 */
export const Required: Story = {
  args: {
    model: { field: '' },
    prop: 'field',
    options: { messages: { required: 'Name is required.' } },
    errors: { required: true },
    touch: true,
  },
};

/**
 * More than one failing rule at once — every error key is listed. Unknown keys
 * fall back to the key name, so always provide `options.messages` for the rules
 * your control uses.
 */
export const MultipleErrors: Story = {
  args: {
    model: { field: 'ab' },
    prop: 'field',
    options: {
      messages: {
        minlength: 'Must be at least 5 characters.',
        pattern: 'Only letters are allowed.',
      },
    },
    errors: { minlength: { requiredLength: 5, actualLength: 2 }, pattern: true },
    touch: true,
  },
};

/**
 * Warnings are non-blocking feedback. They render (with the `warning` style)
 * only when the control has **no** errors.
 */
export const Warning: Story = {
  args: {
    model: { field: 'admin' },
    prop: 'field',
    options: { messages: { reserved: 'This name is commonly used — consider another.' } },
    errors: null,
    warnings: { reserved: true },
    touch: true,
  },
};

/**
 * A pristine (untouched) control shows nothing, even when invalid — errors are
 * only announced after the user has interacted with the field. This story
 * renders an empty region on purpose.
 */
export const PristineHidden: Story = {
  args: {
    model: { field: '' },
    prop: 'field',
    options: { messages: { required: 'Name is required.' } },
    errors: { required: true },
    touch: false,
  },
};

/**
 * `options.showValidationMessage = false` suppresses the block entirely, even
 * for a touched, invalid control.
 */
export const Suppressed: Story = {
  args: {
    model: { field: '' },
    prop: 'field',
    options: { showValidationMessage: false, messages: { required: 'Name is required.' } },
    errors: { required: true },
    touch: true,
  },
};
