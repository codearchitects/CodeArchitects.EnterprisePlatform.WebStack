import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
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
  constructor(private _caepFloatingCommands: ElementRef, private ngZone: NgZone) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      dragElement.bind(this)(this._caepFloatingCommands.nativeElement);
    });
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
