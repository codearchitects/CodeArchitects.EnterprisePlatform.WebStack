import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShSectionComponent } from './section.component';

/**
 * `sh-section` is a layout container that groups related content, projected via
 * `<ng-content>`. When it has a `title` and `isCollapsible` is `true`, the header
 * becomes a disclosure toggle that shows/hides the body; without a title it is a
 * plain, non-collapsible container.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - When collapsible, the header exposes `role="button"`, `tabindex="0"`,
 *   `aria-expanded` and `aria-controls`, and is operable with Enter/Space
 *   (see `onHeaderKeydown`). The body is a labelled `role="region"`.
 * - The header is announced as a heading via `aria-level` — set `headingLevel`
 *   to match the host page's document outline so heading levels are not skipped
 *   (WCAG 1.3.1); the library cannot infer this from inside itself.
 * - A collapsed body is marked `inert`, removing its content from the tab order
 *   and the accessibility tree.
 */
const meta: Meta<ShSectionComponent> = {
  title: 'ng-components/Section',
  component: ShSectionComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    title: { control: 'text', description: 'Header text; when empty the section is not collapsible' },
    isInline: { control: 'boolean', description: 'Positions the section inline with sibling sections' },
    isCollapsible: { control: 'boolean', description: 'Whether the section header toggles the body' },
    collapsed: { control: 'boolean', description: 'Whether the body is currently collapsed' },
    headingLevel: { control: { type: 'number', min: 1, max: 6 }, description: 'ARIA heading level (aria-level) for the header' },
    show: { control: 'boolean', description: 'Whether the section is rendered' },
    collapsedChange: { action: 'collapsedChange' },
  },
  args: {
    title: 'Section title',
    isInline: true,
    isCollapsible: true,
    collapsed: false,
    headingLevel: 2,
    show: true,
  },
  render: (args) => ({
    props: { ...args, body: (args as any).body ?? 'Projected section content goes here.' },
    template: `
      <sh-section
        [title]="title"
        [isInline]="isInline"
        [isCollapsible]="isCollapsible"
        [collapsed]="collapsed"
        [headingLevel]="headingLevel"
        [show]="show"
        (collapsedChange)="collapsedChange($event)"
      >{{ body }}</sh-section>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShSectionComponent & { body: string }>;

/** Collapsible section with a title, expanded by default. Click/Enter/Space on the header toggles it. */
export const Default: Story = {
  args: { body: 'Projected section content goes here.' },
};

/** Same section rendered collapsed — the body is `inert` and hidden until expanded. */
export const Collapsed: Story = {
  args: { collapsed: true, body: 'This content is hidden until the header is activated.' },
};

/**
 * Plain container: no `title`, so the header is non-interactive and the body is
 * always visible (not collapsible).
 */
export const NonCollapsible: Story = {
  args: { title: '', isCollapsible: false, body: 'A static grouping of content with no disclosure header.' },
};

/**
 * A section that has a title but is explicitly not collapsible. The title is
 * still announced as a heading (visually hidden), while the body stays open.
 */
export const TitledNotCollapsible: Story = {
  args: { isCollapsible: false, body: 'Titled but always expanded.' },
};

/** Non-inline layout (`isInline = false`), so the section takes its own block. */
export const Block: Story = {
  args: { isInline: false, body: 'This section is laid out as a standalone block rather than inline.' },
};

/** Deeper heading level for nested outlines (e.g. a subsection at `aria-level="3"`). */
export const NestedHeadingLevel: Story = {
  args: { title: 'Subsection', headingLevel: 3, body: 'Use headingLevel to keep the document outline consistent.' },
};
