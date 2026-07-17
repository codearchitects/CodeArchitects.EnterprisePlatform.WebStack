import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SignalRModule } from '@ca-webstack/ng-signalr';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        SignalRModule
      ]
    }).compileComponents();
  }));
  it('should create the app importing the library module', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
