import { Component, Injector, Output, ViewChild, Input, SimpleChanges, afterNextRender } from '@angular/core';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';
import * as _ from 'lodash-es';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { IN } from '../../utilities/common.utility';
import { ThrottledEventEmitter } from '../../utilities/event-emitter.utility';

/**
 * Base Timer Component options contract
 */
export interface IShTimerOptions extends IShBaseOptions {
  /**
   * Specifies whether to start timer on component instantiation
   * @default true
   */
  autoplay?: boolean;
  /**
   * Formats a date value. See https://angular.io/api/common/DatePipe#usage-notes for format infos
   * @default 'HH:mm:ss'
   */
  format?: string;
  /**
   * A timezone offset (such as '+0430'), or a standard UTC/GMT.
   * When not supplied, uses the end-user's local system timezone
   * @default '+0000'
   */
  timezone?: string;
  /**
   * Specifies whether to show player
   * @default true
   */
  showPlayer?: boolean;
  /**
   * Specifies whether player can stop execution
   * @default true
   */
  canStop?: boolean;
  /**
   * Specifies whether player can start execution
   * @default true
   */
  canStart?: boolean;
  /**
   * Specifies whether player can pause execution
   * @default true
   */
  canPause?: boolean;
  /**
   * Specifies whether player can restart execution
   * @default true
   */
  canRestart?: boolean;
  /**
   * Specifies whether player can resume execution
   * @default true
   */
  canResume?: boolean;
  /**
   * Specifies how to convert formatted time text into HTML
   * or other strings
   * @default undefined
   */
  transform?(text: string): string;
}

/**
 * Timer status
 */
export enum ShTimerStatus {
  /**
   * Timer currently playing
   */
  Play = 0,
  /**
   * Timer currently paused
   */
  Pause = 1,
  /**
   * Timer currently stopped
   */
  Stop = 2,
  /**
   * Timer completed
   */
  Done = 3,
  /**
   * Timer not run yet
   */
  NotRun = 4
}

@Component({
    selector: 'sh-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
    standalone: false
})
/**
 * Base Timer Component
 */
export class ShTimerComponent extends ShBaseAuthComponent<IShTimerOptions> {
  /**
   * Bounded time
   */
  @Input() public model: number;
  /**
   * Emits an event on bounded time changes
   */
  @Output() public modelChange = new ThrottledEventEmitter<number>(500);
  /**
   * Emits an event on timer started
   */
  @Output() public started = new ThrottledEventEmitter(500);
  /**
   * Emits an event on timer finished
   */
  @Output() public done = new ThrottledEventEmitter(500);
  /**
   * Emits an event on timer paused
   */
  @Output() public paused = new ThrottledEventEmitter(500);
  /**
   * Emits an event on timer stopped
   */
  @Output() public stopped = new ThrottledEventEmitter(500);
  /**
   * Emits an event on timer resumed
   */
  @Output() public resumed = new ThrottledEventEmitter(500);
  /**
   * Emits an event on timer restarted
   */
  @Output() public restarted = new ThrottledEventEmitter(500);
  /**
   * References to wrapped control
   */
  @ViewChild('cd', { static: false }) public countdown: CountdownComponent;
  /**
   * Initial left time in seconds
   */
  public leftTime: number;
  /**
   * Translation key for the current discrete timer state, surfaced in the
   * screen-reader-only role="status" live region. Updated ONLY on discrete
   * transitions (start/pause/resume/stop/done/restart) in {@link handleEvent},
   * never on the per-second 'notify' tick, so the polite live region is not
   * flooded with continuous announcements.
   */
  public statusKey: string;
  /**
   * Status of the timer
   */
  public get status(): ShTimerStatus {
    return this.countdown && this.countdown['status'];
  }
  public set status(value: ShTimerStatus) {
    this.countdown['status'] = value;
  }
  /**
   * Specifies whether player can stop execution
   * @default true
   */
  public get canStop() {
    return this.internalOptions.canStop && IN(this.status, ShTimerStatus.Play, ShTimerStatus.Pause);
  }
  /**
   * Specifies whether player can start execution
   * @default true
   */
  public get canStart() {
    return this.internalOptions.canStart && IN(this.status, ShTimerStatus.Done, ShTimerStatus.Stop, ShTimerStatus.NotRun);
  }
  /**
   * Specifies whether player can pause execution
   * @default true
   */
  public get canPause() {
    return this.internalOptions.canPause && IN(this.status, ShTimerStatus.Play);
  }
  /**
   * Specifies whether player can restart execution
   * @default true
   */
  public get canRestart() {
    return this.internalOptions.canRestart && !IN(this.status, ShTimerStatus.Stop, ShTimerStatus.NotRun, ShTimerStatus.Done);
  }
  /**
   * Specifies whether player can resume execution
   * @default true
   */
  public get canResume() {
    return this.internalOptions.canResume && IN(this.status, ShTimerStatus.Pause);
  }

  constructor(injector: Injector) {
    super(injector);
    afterNextRender(() => {
      if (!this.internalOptions.autoplay) {
        this.status = ShTimerStatus.NotRun;
      }
    });
  }

  /**
   * Handles status change event
   * @param event Control event
   */
  public handleEvent(event: CountdownEvent) {
    switch (event.action) {
      case 'start':
        this.statusKey = 'timer-started';
        this.started.emit('start');
        break;
      case 'done':
        this.statusKey = 'timer-done';
        this.done.emit('done');
        break;
      case 'pause':
        this.statusKey = 'timer-paused';
        this.paused.emit('pause');
        break;
      case 'stop':
        this.statusKey = 'timer-stopped';
        this.stopped.emit('stop');
        break;
      case 'resume':
        this.statusKey = 'timer-resumed';
        this.resumed.emit('resume');
        break;
      case 'notify':
        // Per-second tick: update the model only, never the live-region status,
        // otherwise the polite region would announce continuously.
        this.model = event.left / 1000;
        this.modelChange.next(this.model);
        break;
      case 'restart':
        this.statusKey = 'timer-restarted';
        this.restarted.emit('restart');
        break;
      default:
        break;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes?.model?.firstChange) {
      this.leftTime = this.model;
    }
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this.started.unsubscribe();
    this.done.unsubscribe();
    this.paused.unsubscribe();
    this.stopped.unsubscribe();
    this.resumed.unsubscribe();
    this.restarted.unsubscribe();
    this.modelChange.unsubscribe();
  }

  /**
   * Starts timer
   */
  public start() {
    if (IN(this.status, ShTimerStatus.Stop, ShTimerStatus.Done)) {
      this.restart();
    } else {
      this.countdown.begin();
    }
  }

  /**
   * Resets and start timer
   */
  public restart() {
    this.countdown.restart();
    if (!this.internalOptions.autoplay) {
      this.countdown.begin();
    }
  }

  /**
   * Pauses timer
   */
  public pause() {
    this.countdown.pause();
  }

  /**
   * Resumes timer
   */
  public resume() {
    this.countdown.resume();
  }

  /**
   * Stops timer
   */
  public stop() {
    this.countdown.stop();
  }

  public getDefaultOptions() {
    return _.merge(super.getDefaultOptions(), <IShTimerOptions>{
      autoplay: true,
      format: 'HH:mm:ss',
      showPlayer: true,
      canStop: true,
      canStart: true,
      canPause: true,
      canRestart: true,
      canResume: true
    });
  }

}
