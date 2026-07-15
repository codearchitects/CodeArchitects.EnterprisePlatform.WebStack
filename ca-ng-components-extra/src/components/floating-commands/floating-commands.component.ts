import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

var floatingCommandsId = 0;
@Component({
    selector: 'caep-floating-commands',
    templateUrl: './floating-commands.component.html',
    styleUrls: ['./floating-commands.component.scss'],
    host: { class: 'caep-floating-commands' },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepFloatingCommandsComponent implements OnInit, AfterViewInit {
  private _isDragging = false;
  public get isDragging() {
    return this._isDragging;
  }
  public set isDragging(value) {
    this._isDragging = value;
    this._caepFloatingCommands.nativeElement.classList.toggle('floating-commands-state__dragging', this._isDragging);
  }
  @HostBinding('id')
  public id = floatingCommandsId++;
  /**
   * Accessible name for the `role="toolbar"` region that groups the projected
   * command controls. Recommended when a page exposes more than one floating
   * commands toolbar so assistive technology can distinguish them. Renders no
   * `aria-label` attribute when unset.
   */
  @Input() public ariaLabel?: string;
  /**
   * Accessible name for the drag handle, which is exposed as a `role="button"`
   * control so the toolbar can be repositioned with the keyboard (Arrow keys to
   * move, Home/End to jump to the top-left / bottom-right of the viewport) as a
   * single-pointer/keyboard alternative to dragging (WCAG 2.5.7, 2.1.1). A
   * sensible English default is provided so the control is never unnamed;
   * supply a localized string to override it.
   */
  @Input() public dragHandleAriaLabel = 'Move commands toolbar';
  constructor(private _caepFloatingCommands: ElementRef, private ngZone: NgZone) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      dragElement.bind(this)(this._caepFloatingCommands.nativeElement);
    });
  }

  /**
   * Keyboard alternative to the pointer drag. Repositions the floating commands
   * using the exact same clamping/vertical-flip math as {@link dragElement}'s
   * pointer handler, so keyboard-only users can move the bar to reveal content
   * underneath it. Arrow keys nudge, Home jumps to the top-left corner and End
   * to the bottom-right.
   */
  public onDragHandleKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const element = this._caepFloatingCommands.nativeElement as HTMLElement;
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight);
    const rect = element.getBoundingClientRect();

    const stepX = Math.max(vw * 0.02, 10);
    const stepY = Math.max(vh * 0.02, 10);

    // Mirror the pointer drag: (eventX, eventY) is the desired top-left point.
    let eventX = rect.left;
    let eventY = rect.top;
    switch (key) {
      case 'ArrowLeft':
        eventX -= stepX;
        break;
      case 'ArrowRight':
        eventX += stepX;
        break;
      case 'ArrowUp':
        eventY -= stepY;
        break;
      case 'ArrowDown':
        eventY += stepY;
        break;
      case 'Home':
        eventX = 0;
        eventY = 0;
        break;
      case 'End':
        eventX = vw;
        eventY = vh;
        break;
    }

    eventX = Math.min(Math.max(eventX, 0), vw);
    eventY = Math.min(Math.max(eventY, 0), vh);

    const { clientWidth, clientHeight } = element;
    const isVertical = eventX + clientWidth > vw;

    const newTop = Math.min(eventY, vh - (isVertical ? clientWidth : clientHeight));
    element.style.top = (newTop / vh) * 100 + '%';

    const newLeft = isVertical ? vw - clientHeight : Math.min(eventX, vw - clientWidth);
    element.style.left = (newLeft / vw) * 100 + '%';

    element.classList.toggle('vertical', isVertical);
  }
}

function dragElement(element: any) {
  var isVertical = false;
  const newLocal = document.getElementById(element.id + '-caepDragHandle');
  if (newLocal) {
    // if present, the header is where you move the DIV from:
    newLocal.onpointerdown = dragMouseDown.bind(this);
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    element.onpointerdown = dragMouseDown.bind(this);
  }

  function dragMouseDown(e: PointerEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    this.isDragging = true;

    document.onpointerup = closeDragElement.bind(this);
    // document.onpointerleave = closeDragElement;
    // call a function whenever the cursor moves:
    document.onpointermove = elementDrag.bind(this);
  }

  function elementDrag(e: PointerEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight);

    let eventX = Math.min(Math.max(e.clientX, 0), vw);
    let eventY = Math.min(Math.max(e.clientY, 0), vh);

    const { clientWidth, clientHeight } = element;

    isVertical = eventX + clientWidth > vw;

    const newTop = Math.min(eventY, vh - (isVertical ? clientWidth : clientHeight));
    element.style.top = (newTop / vh) * 100 + '%';

    let newLeft = isVertical ? vw - clientHeight : Math.min(eventX, vw - clientWidth);

    element.style.left = (newLeft / vw) * 100 + '%';

    element.classList.toggle('vertical', isVertical);
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onpointerup = null;
    document.onpointermove = null;
    this.isDragging = false;
  }
}
