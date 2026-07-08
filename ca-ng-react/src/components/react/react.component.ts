import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil, throttleTime } from 'rxjs/operators';
import { ShBaseReactComponent } from '../base/base.component';

@Component({
    selector: 'sh-react-component',
    template: '',
    standalone: false
})
/**
 * React Host Component
 */
export class ShReactHostComponent<TProps = {}, TState = TProps> implements OnChanges, OnInit {
  /**
   * React component class
   */
  @Input() public component: React.ComponentClass<TProps, TState>;
  /**
   * React component properties
   */
  @Input() public props: TProps;
  /**
   * Emits a change event only after a particular time span has passed without another source emission
   */
  @Input() public debounceTime = 0;
  /**
   * Emits a change event, then ignores subsequent source values for duration milliseconds, then repeats this process.
   */
  @Input() public throttleTime = 0;
  /**
   * Event fired when react component state changes
   */
  @Output() public change = new EventEmitter<TState>();
  /**
   * Subject which notifies subscribers when component destroy itself
   */
  protected destroy$ = new Subject<void>();
  /**
   * Observable of state changes
   */
  private _state$ = new Subject<TState>();
  /**
   * Specifies whether component has been rendered
   */
  private _isRendered: boolean;
  /**
   * List of component subscriptions
   */
  private _subscriptions: Subscription[] = [];

  /**
   * React Host Component
   */
  constructor(private _element: ElementRef) { }

  public ngOnInit() {
    if (!this._isRendered) {
      this.render();
    }
    this._subscriptions.push(this._state$
      .pipe(
        debounceTime(this.debounceTime),
        throttleTime(this.throttleTime)
      )
      .subscribe(state => this.change.emit(state))
    );
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.props) {
      this.render();
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    this._subscriptions = [];
    if (!ReactDOM.unmountComponentAtNode(this._element.nativeElement)) {
      console.error('Leak detected: Component unmount failed');
    }
  }

  /**
   * Render component
   */
  private render() {
    const component = ReactDOM.render(React.createElement(this.component, this.props), this._element.nativeElement) as ShBaseReactComponent<TProps, TState>;
    component.change$ = this._state$;
    this._isRendered = true;
  }
}
