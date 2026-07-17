import * as React from 'react';
import { Subject } from 'rxjs';

/**
 * Base React Component
 */
export abstract class ShBaseReactComponent<TProps = {}, TState = {}> extends React.Component<TProps, TState> {
  /**
   * Observable of state changes
   */
  public change$ = new Subject<TState>();
  /**
   * Reference to react component element.
   * If you want to refere to this element, you must link
   * this property to rendering element with ref prop in
   * render method (<div ref={this.element}></div>)
   */
  protected element: React.RefObject<HTMLDivElement>;
  /**
   * Subject which notifies subscribers when component destroy itself
   */
  protected destroy$ = new Subject();

  /**
   * Base React Component
   * @param props React component properties
   */
  constructor(props: TProps) {
    super(props);
    this.element = React.createRef();
  }

  public setState(state: TState | any) {
    super.setState(state);
    setTimeout(() => this.change$.next(this.state));
  }
}
